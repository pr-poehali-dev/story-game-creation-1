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

  const [gameStarted, setGameStarted] = useState(false);
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
    },
    {
      id: 'trade',
      speaker: 'Торговый Магнат',
      faction: 'federation',
      text: 'Открылся новый торговый маршрут через нейтральную зону. Технократия предлагает автоматизацию, Федерация — свободную торговлю, Империя хочет установить контроль.',
      choices: [
        {
          id: 'automate',
          text: 'Внедрить автоматизированные системы Технократии',
          impact: [
            { factionId: 'technocracy', change: 18 },
            { factionId: 'federation', change: 5 },
            { factionId: 'imperium', change: -8 }
          ]
        },
        {
          id: 'free_trade',
          text: 'Открыть свободную торговлю для всех',
          impact: [
            { factionId: 'federation', change: 18 },
            { factionId: 'technocracy', change: -3 },
            { factionId: 'imperium', change: -12 }
          ]
        },
        {
          id: 'control',
          text: 'Установить военный контроль Империи',
          impact: [
            { factionId: 'imperium', change: 18 },
            { factionId: 'federation', change: -18 },
            { factionId: 'technocracy', change: -5 }
          ]
        }
      ]
    },
    {
      id: 'crisis',
      speaker: 'Командор Флота',
      faction: 'imperium',
      text: 'Неизвестная угроза приближается к границам галактики. Необходимо срочно принять решение о стратегии защиты.',
      choices: [
        {
          id: 'ai_defense',
          text: 'Запустить оборонную систему ИИ Технократии',
          impact: [
            { factionId: 'technocracy', change: 22 },
            { factionId: 'federation', change: -8 },
            { factionId: 'imperium', change: -5 }
          ]
        },
        {
          id: 'alliance',
          text: 'Создать объединённый флот всех фракций',
          impact: [
            { factionId: 'federation', change: 22 },
            { factionId: 'technocracy', change: 8 },
            { factionId: 'imperium', change: 8 }
          ]
        },
        {
          id: 'preemptive',
          text: 'Нанести упреждающий удар силами Империи',
          impact: [
            { factionId: 'imperium', change: 22 },
            { factionId: 'federation', change: -20 },
            { factionId: 'technocracy', change: 3 }
          ]
        }
      ]
    },
    {
      id: 'discovery',
      speaker: 'Главный Учёный',
      faction: 'technocracy',
      text: 'Технократия сделала революционное открытие в области энергии. Это может изменить баланс сил. Как распорядиться этой технологией?',
      choices: [
        {
          id: 'monopoly',
          text: 'Передать эксклюзивные права Технократии',
          impact: [
            { factionId: 'technocracy', change: 25 },
            { factionId: 'federation', change: -15 },
            { factionId: 'imperium', change: -12 }
          ]
        },
        {
          id: 'share',
          text: 'Разделить технологию между всеми фракциями',
          impact: [
            { factionId: 'federation', change: 20 },
            { factionId: 'technocracy', change: -10 },
            { factionId: 'imperium', change: 5 }
          ]
        },
        {
          id: 'weaponize',
          text: 'Использовать для создания нового оружия',
          impact: [
            { factionId: 'imperium', change: 25 },
            { factionId: 'federation', change: -22 },
            { factionId: 'technocracy', change: 8 }
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

  const getEnding = () => {
    const winner = getWinningFaction();
    const endings: Record<string, { title: string; description: string; icon: string }> = {
      technocracy: {
        title: 'Эра Технократии',
        description: 'Галактика вступила в новую эпоху технологического прогресса. Искусственный интеллект и автоматизация принесли невиданное процветание, но некоторые опасаются потери человечности.',
        icon: 'Cpu'
      },
      federation: {
        title: 'Галактическое Единство',
        description: 'Дипломатия восторжествовала. Все фракции объединились в мощный союз, где каждый голос имеет значение. Галактика живёт в мире и процветании.',
        icon: 'Globe'
      },
      imperium: {
        title: 'Имперский Порядок',
        description: 'Сильная рука Империи установила порядок в галактике. Военная мощь обеспечивает безопасность, но свобода стала роскошью, которую могут позволить себе немногие.',
        icon: 'Crown'
      }
    };

    return endings[winner.id];
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentStep(0);
    setFactions([
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
    setSelectedChoice(null);
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

      {!gameStarted ? (
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col items-center justify-center">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-7xl font-bold mb-4 text-primary" style={{ textShadow: '0 0 30px rgba(0, 217, 255, 0.7)' }}>
              ГАЛАКТИЧЕСКИЙ СОВЕТ
            </h1>
            <p className="text-muted-foreground text-2xl mb-2">Политическая стратегия</p>
            <p className="text-foreground/70 text-lg">Ваши решения определяют судьбу цивилизаций</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
            {[
              { name: 'Технократия Нексус', icon: 'Cpu', color: '#00D9FF', desc: 'Технологии и ИИ' },
              { name: 'Галактическая Федерация', icon: 'Globe', color: '#9b87f5', desc: 'Дипломатия и мир' },
              { name: 'Звёздная Империя', icon: 'Crown', color: '#F97316', desc: 'Военная мощь' }
            ].map((faction, index) => (
              <Card 
                key={faction.name}
                className="p-6 bg-card/60 backdrop-blur-sm border-2 text-center animate-scale-in hover:scale-105 transition-transform"
                style={{ 
                  borderColor: faction.color,
                  animationDelay: `${index * 0.15}s`,
                  boxShadow: `0 0 25px ${faction.color}30`
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ backgroundColor: `${faction.color}20` }}
                >
                  <Icon name={faction.icon as any} size={32} style={{ color: faction.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: faction.color }}>
                  {faction.name}
                </h3>
                <p className="text-sm text-muted-foreground">{faction.desc}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl font-bold animate-pulse-glow"
            >
              <Icon name="Play" size={24} className="mr-3" />
              Начать игру
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                5 эпизодов • 3 уникальные концовки • Система влияния
              </p>
            </div>
          </div>
        </div>
      ) : (
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
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                style={{ 
                  backgroundColor: `${getWinningFaction().color}30`,
                  boxShadow: `0 0 40px ${getWinningFaction().color}60`
                }}
              >
                <Icon name={getEnding().icon as any} size={40} style={{ color: getWinningFaction().color }} />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3" style={{ color: getWinningFaction().color }}>
              {getEnding().title}
            </h2>
            <div className="inline-block mb-6">
              <Badge 
                className="text-lg py-2 px-4"
                style={{ 
                  backgroundColor: getWinningFaction().color,
                  color: '#0A0E27'
                }}
              >
                {getWinningFaction().name} — {getWinningFaction().influence}% влияния
              </Badge>
            </div>
            <p className="text-lg text-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              {getEnding().description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {factions.map((faction) => (
                <div key={faction.id} className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{faction.name}</p>
                  <div className="text-2xl font-bold" style={{ color: faction.color }}>
                    {faction.influence}%
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={startGame}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                <Icon name="RotateCcw" size={20} className="mr-2" />
                Начать новую историю
              </Button>
              <Button
                onClick={() => setGameStarted(false)}
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 px-8 py-3 text-lg"
              >
                <Icon name="Home" size={20} className="mr-2" />
                Главное меню
              </Button>
            </div>
          </Card>
        )}
      </div>
      )}
    </div>
  );
};

export default Index;