import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Faction {
  id: string;
  name: string;
  icon: string;
  color: string;
  influence: number;
  description: string;
}

interface DialogChoice {
  id: string;
  text: string;
  impact: {
    factionId: string;
    change: number;
  }[];
}

interface DialogStep {
  id: string;
  speaker: string;
  faction: string;
  text: string;
  choices: DialogChoice[];
}

const Index = () => {
  const [factions, setFactions] = useState<Faction[]>([
    {
      id: 'technocracy',
      name: 'Технократия Нексус',
      icon: 'Cpu',
      color: '#00D9FF',
      influence: 50,
      description: 'Передовые технологии и искусственный интеллект'
    },
    {
      id: 'federation',
      name: 'Галактическая Федерация',
      icon: 'Globe',
      color: '#9b87f5',
      influence: 50,
      description: 'Дипломатия и объединение народов'
    },
    {
      id: 'imperium',
      name: 'Звёздная Империя',
      icon: 'Crown',
      color: '#F97316',
      influence: 50,
      description: 'Военная мощь и экспансия'
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const dialogSteps: DialogStep[] = [
    {
      id: 'intro',
      speaker: 'Адмирал Вектор',
      faction: 'federation',
      text: 'Командор, мы обнаружили неизвестный артефакт древней цивилизации. Три фракции требуют передать его им. Ваше решение определит будущее галактики.',
      choices: [
        {
          id: 'tech',
          text: 'Передать Технократии для исследования',
          impact: [
            { factionId: 'technocracy', change: 20 },
            { factionId: 'federation', change: -10 },
            { factionId: 'imperium', change: -10 }
          ]
        },
        {
          id: 'fed',
          text: 'Отдать Федерации для общего блага',
          impact: [
            { factionId: 'federation', change: 20 },
            { factionId: 'technocracy', change: -5 },
            { factionId: 'imperium', change: -15 }
          ]
        },
        {
          id: 'emp',
          text: 'Передать Империи для защиты',
          impact: [
            { factionId: 'imperium', change: 20 },
            { factionId: 'technocracy', change: -10 },
            { factionId: 'federation', change: -10 }
          ]
        }
      ]
    },
    {
      id: 'conflict',
      speaker: 'Верховный Консул',
      faction: 'technocracy',
      text: 'Вспыхнул пограничный конфликт. Технократия требует немедленной поддержки. Федерация призывает к переговорам. Империя готова к силовому решению.',
      choices: [
        {
          id: 'support_tech',
          text: 'Поддержать Технократию военными силами',
          impact: [
            { factionId: 'technocracy', change: 15 },
            { factionId: 'federation', change: -20 },
            { factionId: 'imperium', change: 5 }
          ]
        },
        {
          id: 'negotiate',
          text: 'Организовать дипломатические переговоры',
          impact: [
            { factionId: 'federation', change: 15 },
            { factionId: 'technocracy', change: -5 },
            { factionId: 'imperium', change: -10 }
          ]
        },
        {
          id: 'military',
          text: 'Применить военную силу',
          impact: [
            { factionId: 'imperium', change: 15 },
            { factionId: 'federation', change: -15 },
            { factionId: 'technocracy', change: 0 }
          ]
        }
      ]
    }
  ];

  const currentDialog = dialogSteps[currentStep];

  useEffect(() => {
    if (!currentDialog) return;
    
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    const text = currentDialog.text;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [currentStep, currentDialog]);

  const handleChoice = (choice: DialogChoice) => {
    setSelectedChoice(choice.id);
    
    setTimeout(() => {
      const newFactions = factions.map(faction => {
        const impact = choice.impact.find(i => i.factionId === faction.id);
        if (impact) {
          return {
            ...faction,
            influence: Math.max(0, Math.min(100, faction.influence + impact.change))
          };
        }
        return faction;
      });
      
      setFactions(newFactions);
      
      setTimeout(() => {
        if (currentStep < dialogSteps.length - 1) {
          setCurrentStep(currentStep + 1);
          setSelectedChoice(null);
        }
      }, 1000);
    }, 500);
  };

  const getWinningFaction = () => {
    return factions.reduce((prev, current) => 
      prev.influence > current.influence ? prev : current
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-layer absolute inset-0" style={{
          background: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                       radial-gradient(2px 2px at 60% 70%, white, transparent),
                       radial-gradient(1px 1px at 50% 50%, white, transparent),
                       radial-gradient(1px 1px at 80% 10%, white, transparent),
                       radial-gradient(2px 2px at 90% 60%, white, transparent),
                       radial-gradient(1px 1px at 33% 80%, white, transparent),
                       radial-gradient(1px 1px at 15% 90%, white, transparent)`,
          backgroundSize: '200% 200%',
          animation: 'stars 100s linear infinite'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 text-primary" style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}>
            ГАЛАКТИЧЕСКИЙ СОВЕТ
          </h1>
          <p className="text-muted-foreground text-lg">Ваши решения определяют судьбу цивилизаций</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {factions.map((faction, index) => (
            <Card 
              key={faction.id} 
              className="p-4 bg-card/80 backdrop-blur-sm border-2 animate-scale-in"
              style={{ 
                borderColor: faction.color,
                animationDelay: `${index * 0.1}s`,
                boxShadow: `0 0 20px ${faction.color}40`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${faction.color}20` }}
                >
                  <Icon name={faction.icon as any} size={24} style={{ color: faction.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: faction.color }}>{faction.name}</h3>
                  <p className="text-xs text-muted-foreground">{faction.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Влияние</span>
                  <span className="font-bold" style={{ color: faction.color }}>{faction.influence}%</span>
                </div>
                <Progress 
                  value={faction.influence} 
                  className="h-2"
                  style={{
                    backgroundColor: '#1a1f2c'
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        {currentDialog && (
          <Card className="p-6 bg-card/90 backdrop-blur-md border-primary/30 animate-fade-in">
            <div className="mb-4">
              <Badge 
                className="mb-2"
                style={{ 
                  backgroundColor: factions.find(f => f.id === currentDialog.faction)?.color || '#00D9FF',
                  color: '#0A0E27'
                }}
              >
                {currentDialog.speaker}
              </Badge>
              <p className="text-foreground text-lg leading-relaxed min-h-[80px]">
                {displayedText}
                {isTyping && <span className="animate-pulse">▊</span>}
              </p>
            </div>

            {!isTyping && (
              <div className="space-y-3 mt-6">
                {currentDialog.choices.map((choice, index) => (
                  <Button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    disabled={selectedChoice !== null}
                    className="w-full justify-start text-left h-auto py-4 px-6 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary transition-all duration-300 animate-scale-in"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      backgroundColor: selectedChoice === choice.id ? 'rgba(0, 217, 255, 0.3)' : undefined,
                      boxShadow: selectedChoice === choice.id ? '0 0 30px rgba(0, 217, 255, 0.5)' : undefined
                    }}
                    variant="outline"
                  >
                    <div className="flex items-start gap-3">
                      <Icon 
                        name="ChevronRight" 
                        className="mt-1 flex-shrink-0" 
                        size={20}
                        style={{ color: '#00D9FF' }}
                      />
                      <span className="text-foreground">{choice.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </Card>
        )}

        {currentStep >= dialogSteps.length && (
          <Card className="p-8 bg-card/90 backdrop-blur-md border-primary/30 text-center animate-scale-in">
            <h2 className="text-3xl font-bold mb-4 text-primary">Эпилог</h2>
            <p className="text-lg mb-4">
              Ваши решения привели к доминированию фракции:
            </p>
            <div className="inline-block">
              <Badge 
                className="text-2xl py-3 px-6"
                style={{ 
                  backgroundColor: getWinningFaction().color,
                  color: '#0A0E27'
                }}
              >
                {getWinningFaction().name}
              </Badge>
            </div>
            <p className="mt-6 text-muted-foreground">
              Влияние: {getWinningFaction().influence}%
            </p>
            <Button
              onClick={() => {
                setCurrentStep(0);
                setFactions(factions.map(f => ({ ...f, influence: 50 })));
              }}
              className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Начать заново
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
