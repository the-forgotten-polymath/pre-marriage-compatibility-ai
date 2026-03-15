import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { assessmentQuestions } from '@/data/assessmentQuestions';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssessmentProps {
  onComplete: (responses: { questionId: number; importance: number; flexibility: number; }[]) => void;
  onCancel: () => void;
  partnerType: 'A' | 'B';
}

const VoiceAssessment = ({ onComplete, onCancel, partnerType }: VoiceAssessmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ questionId: number; importance: number; flexibility: number; }[]>([]);
  const [currentMode, setCurrentMode] = useState<'listening' | 'importance' | 'flexibility' | 'next'>('listening');
  const [isListening, setIsListening] = useState(false);
  const [currentResponse, setCurrentResponse] = useState({ importance: 0, flexibility: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  useEffect(() => {
    checkPermissionsAndInitialize();
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const result = event.results[0][0].transcript;
          console.log('Voice recognition result:', result);
          handleVoiceResult(result);
        };
        
        recognitionRef.current.onerror = (error) => {
          console.error('Speech recognition error:', error);
          toast({
            title: "Voice Recognition Error",
            description: "Could not understand your response. Please try speaking again.",
            variant: "destructive",
          });
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (synthRef.current && currentQuestion && permissionGranted) {
      speakQuestion();
    }
  }, [currentQuestionIndex, permissionGranted]);

  const checkPermissionsAndInitialize = async () => {
    try {
      setIsInitializing(true);
      
      // Check if we're on HTTPS or localhost
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isSecure) {
        toast({
          title: "Secure Connection Required",
          description: "Voice features require HTTPS. Please use the secure version of this site.",
          variant: "destructive",
        });
        setIsInitializing(false);
        return;
      }

      // Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        setPermissionGranted(true);
        
        toast({
          title: "Voice Ready!",
          description: "Microphone access granted. You can now use voice features.",
        });
      } catch (permissionError) {
        console.error('Microphone permission denied:', permissionError);
        toast({
          title: "Microphone Permission Required",
          description: "Please allow microphone access to use voice features.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing voice features:', error);
      toast({
        title: "Voice Initialization Failed",
        description: "Could not initialize voice features. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setSpeaking(false);
      toast({
        title: "Speech Error",
        description: "There was an issue with text-to-speech. Please try again.",
        variant: "destructive",
      });
    };
    
    synthRef.current.speak(utterance);
  };

  const speakQuestion = () => {
    if (currentMode === 'listening') {
      const questionText = `Question ${currentQuestionIndex + 1} of ${assessmentQuestions.length}. ${currentQuestion?.question}. Please rate how important this is to you from 1 to 5, where 1 is not important and 5 is extremely important.`;
      speak(questionText);
      setCurrentMode('importance');
    }
  };

  const handleVoiceResult = (result: string) => {
    const number = extractNumberFromSpeech(result);
    
    if (number >= 1 && number <= 5) {
      if (currentMode === 'importance') {
        setCurrentResponse(prev => ({ ...prev, importance: number }));
        setIsListening(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        const flexibilityText = `You rated importance as ${number}. Now, how much flexibility do you have on this topic? Rate from 1 to 5, where 1 is very flexible and 5 is non-negotiable.`;
        speak(flexibilityText);
        setCurrentMode('flexibility');
        
        setTimeout(() => {
          setIsListening(true);
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 3000);
        
      } else if (currentMode === 'flexibility') {
        const newResponse = { 
          questionId: currentQuestion.id, 
          importance: currentResponse.importance, 
          flexibility: number 
        };
        
        setResponses(prev => [...prev, newResponse]);
        setCurrentResponse({ importance: 0, flexibility: 0 });
        setIsListening(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        if (currentQuestionIndex < assessmentQuestions.length - 1) {
          const nextText = `Thank you. Moving to the next question.`;
          speak(nextText);
          
          setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentMode('listening');
          }, 2000);
        } else {
          speak("Assessment complete! Thank you for your responses.");
          setTimeout(() => {
            onComplete(responses.concat(newResponse));
          }, 2000);
        }
      }
    } else {
      speak("Please say a number from 1 to 5.");
    }
  };

  const extractNumberFromSpeech = (text: string): number => {
    const words = text.toLowerCase();
    const numberWords: { [key: string]: number } = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
    };
    
    for (const word in numberWords) {
      if (words.includes(word)) {
        return numberWords[word];
      }
    }
    
    const numberMatch = text.match(/\d/);
    if (numberMatch) {
      const num = parseInt(numberMatch[0]);
      if (num >= 1 && num <= 5) return num;
    }
    
    return 0;
  };

  const startListening = async () => {
    if (!permissionGranted) {
      await checkPermissionsAndInitialize();
      return;
    }
    
    try {
      setIsListening(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Cannot Start Listening",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleSpeaking = () => {
    if (speaking) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setSpeaking(false);
    } else {
      speakQuestion();
    }
  };

  const speechSupported = 'speechSynthesis' in window;
  const recognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Initializing Voice Features</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p>Setting up voice recognition and text-to-speech...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!speechSupported || !recognitionSupported) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Voice Assessment Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p>Your browser doesn't support voice features:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {!speechSupported && <li>• Text-to-speech not supported</li>}
                {!recognitionSupported && <li>• Speech recognition not supported</li>}
              </ul>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Try using Chrome, Safari, or Edge for the best voice experience.</p>
            </div>
            <Button onClick={onCancel}>Return to Regular Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!permissionGranted) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Microphone Permission Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <Mic className="w-12 h-12 mx-auto text-muted-foreground" />
              <p>Voice assessment requires microphone access to hear your responses.</p>
              <p className="text-sm text-muted-foreground">
                Your privacy is protected - audio is only processed locally and never stored.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={checkPermissionsAndInitialize}>Grant Microphone Access</Button>
              <Button onClick={onCancel} variant="outline">Use Regular Assessment Instead</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Voice Assessment - Partner {partnerType}
              </CardTitle>
              <Badge variant="secondary" className="mt-2">
                Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-lg font-semibold">{Math.round(progress)}%</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">{currentQuestion?.question}</h3>
            <p className="text-sm text-muted-foreground mb-4">Category: {currentQuestion?.category}</p>
            
            {currentMode === 'importance' && (
              <p className="text-sm bg-masculine-light p-3 rounded-lg">
                Rate the importance (1-5): 1 = Not important, 5 = Extremely important
              </p>
            )}
            
            {currentMode === 'flexibility' && (
              <p className="text-sm bg-feminine-light p-3 rounded-lg">
                Rate your flexibility (1-5): 1 = Very flexible, 5 = Non-negotiable
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? "Stop Listening" : "Start Speaking"}
            </Button>
            
            <Button
              onClick={toggleSpeaking}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              {speaking ? "Stop Audio" : "Repeat Question"}
            </Button>
          </div>

          {isListening && (
            <div className="text-center">
              <div className="animate-pulse text-green-600">
                🎤 Listening...
              </div>
            </div>
          )}

          {speaking && (
            <div className="text-center">
              <div className="animate-pulse text-blue-600">
                🔊 Playing audio...
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={onCancel} variant="outline">
              Cancel Assessment
            </Button>
            
            {currentQuestionIndex > 0 && (
              <Button 
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                variant="outline"
              >
                Previous Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssessment;