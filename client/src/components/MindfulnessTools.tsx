import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { cardEntranceVariants, gentleEntranceVariants, createButtonVariants, useReducedMotion } from '@/utils/motionVariants';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface BreathingExercise {
  name: string;
  description: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
}

const breathingExercises: BreathingExercise[] = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Great for relaxation.",
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    cycles: 4
  },
  {
    name: "Box Breathing",
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds.",
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 4
  },
  {
    name: "Deep Breathing",
    description: "Slow, deep breaths to calm your nervous system.",
    inhaleTime: 5,
    holdTime: 2,
    exhaleTime: 6,
    cycles: 5
  }
];

export default function MindfulnessTools() {
  const reduceMotion = useReducedMotion();
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(200, 200);
    camera.position.z = 5;

    // Create sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x8884d8,
      transparent: true,
      opacity: 0.7
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    sphereRef.current = sphere;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  // Breathing timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && selectedExercise) {
      const runCycle = () => {
        const phases = [
          { phase: 'inhale' as const, duration: selectedExercise.inhaleTime },
          { phase: 'hold' as const, duration: selectedExercise.holdTime },
          { phase: 'exhale' as const, duration: selectedExercise.exhaleTime },
        ];

        let phaseIndex = 0;
        let timeRemaining = phases[0].duration;

        const updateTimer = () => {
          setTimeLeft(timeRemaining);
          setCurrentPhase(phases[phaseIndex].phase);
          setProgress(((phases[phaseIndex].duration - timeRemaining) / phases[phaseIndex].duration) * 100);

          // Update sphere scale based on breathing phase
          if (sphereRef.current) {
            let scale = 1;
            if (phases[phaseIndex].phase === 'inhale') {
              scale = 1 + (1 - timeRemaining / phases[phaseIndex].duration) * 0.5;
            } else if (phases[phaseIndex].phase === 'exhale') {
              scale = 1.5 - (1 - timeRemaining / phases[phaseIndex].duration) * 0.5;
            }
            sphereRef.current.scale.setScalar(scale);
          }

          timeRemaining--;

          if (timeRemaining < 0) {
            phaseIndex++;
            if (phaseIndex >= phases.length) {
              // Cycle complete
              setCurrentCycle(prev => {
                const newCycle = prev + 1;
                if (newCycle >= selectedExercise.cycles) {
                  setIsActive(false);
                  setCurrentPhase('rest');
                  setTimeLeft(0);
                  setProgress(0);
                  return 0;
                }
                return newCycle;
              });
              if (currentCycle < selectedExercise.cycles - 1) {
                runCycle();
              }
              return;
            }
            timeRemaining = phases[phaseIndex].duration;
          }
        };

        updateTimer();
        interval = setInterval(updateTimer, 1000);
      };

      runCycle();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, selectedExercise, currentCycle]);

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeLeft(exercise.inhaleTime);
    setProgress(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('rest');
    setCurrentCycle(0);
    setTimeLeft(0);
    setProgress(0);
    if (sphereRef.current) {
      sphereRef.current.scale.setScalar(1);
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'rest': return 'Ready to Begin';
      default: return '';
    }
  };

  return (
    <motion.div
      variants={cardEntranceVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Exercise Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            Breathing Exercises
          </CardTitle>
          <CardDescription>
            Choose a breathing exercise to help you relax and center yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {breathingExercises.map((exercise, index) => (
              <motion.div
                key={index}
                variants={gentleEntranceVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full text-left h-auto p-4"
                  onClick={() => startExercise(exercise)}
                  disabled={isActive}
                >
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {exercise.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {exercise.cycles} cycles • {exercise.inhaleTime}-{exercise.holdTime}-{exercise.exhaleTime} pattern
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Exercise */}
      {selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{selectedExercise.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 3D Visualization */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border rounded-lg"
                width={200}
                height={200}
              />
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{getPhaseText()}</span>
                <span>{timeLeft}s</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Cycle Counter */}
            <div className="text-center">
              <div className="text-2xl font-bold">
                {currentCycle + 1} / {selectedExercise.cycles}
              </div>
              <div className="text-sm text-muted-foreground">Cycles completed</div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2">
              <motion.div {...createButtonVariants(reduceMotion)}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isActive ? pauseExercise : () => startExercise(selectedExercise)}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </motion.div>
              <motion.div {...createButtonVariants(reduceMotion)}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetExercise}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              {currentPhase === 'inhale' && "Breathe in slowly through your nose"}
              {currentPhase === 'hold' && "Hold your breath comfortably"}
              {currentPhase === 'exhale' && "Breathe out slowly through your mouth"}
              {currentPhase === 'rest' && "Click play when you're ready to begin"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Breathing Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Reduces stress and anxiety</li>
            <li>• Improves focus and concentration</li>
            <li>• Lowers blood pressure</li>
            <li>• Enhances emotional regulation</li>
            <li>• Promotes better sleep</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
