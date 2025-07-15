import React, { useState, useEffect, useRef } from 'react';
import { Zap, Timer, Sword, Shield, Star, Eye, AlertTriangle } from 'lucide-react';

const MagicTypingGame = () => {
  const [gameState, setGameState] = useState('ready'); // ready, playing, result, gameover
  const [playerSpell, setPlayerSpell] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [npcScore, setNpcScore] = useState(0);
  const [currentMP, setCurrentMP] = useState(100); // 마나포인트
  const [battleResult, setBattleResult] = useState(null);
  const [npcSpell, setNpcSpell] = useState('');
  const [playerAnalysis, setPlayerAnalysis] = useState(null);
  const [npcAnalysis, setNpcAnalysis] = useState(null);
  const [estimatedMP, setEstimatedMP] = useState(0); // 예상 마나 비용
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // 마법 분석 데이터
  const magicData = {
    elements: {
      // 기본 속성 (마나 비용 대폭 감소)
      '불': { power: 8, weakness: '물', strength: '얼음', color: 'text-red-500', manaCost: 2 },
      '화염': { power: 8, weakness: '물', strength: '얼음', color: 'text-red-500', manaCost: 2 },
      '불꽃': { power: 7, weakness: '물', strength: '얼음', color: 'text-red-500', manaCost: 2 },
      '용암': { power: 10, weakness: '물', strength: '얼음', color: 'text-red-600', manaCost: 4 },
      '화염술': { power: 9, weakness: '물', strength: '얼음', color: 'text-red-500', manaCost: 3 },
      
      '물': { power: 6, weakness: '번개', strength: '불', color: 'text-blue-500', manaCost: 2 },
      '얼음': { power: 6, weakness: '불', strength: '바람', color: 'text-cyan-500', manaCost: 2 },
      '서리': { power: 7, weakness: '불', strength: '바람', color: 'text-cyan-400', manaCost: 3 },
      '빙하': { power: 9, weakness: '불', strength: '바람', color: 'text-cyan-600', manaCost: 4 },
      '냉기': { power: 5, weakness: '불', strength: '바람', color: 'text-cyan-300', manaCost: 2 },
      
      '바람': { power: 5, weakness: '얼음', strength: '번개', color: 'text-green-500', manaCost: 2 },
      '폭풍': { power: 8, weakness: '얼음', strength: '번개', color: 'text-green-600', manaCost: 3 },
      '회오리바람': { power: 7, weakness: '얼음', strength: '번개', color: 'text-green-500', manaCost: 3 },
      '돌풍': { power: 6, weakness: '얼음', strength: '번개', color: 'text-green-400', manaCost: 2 },
      
      '번개': { power: 9, weakness: '바람', strength: '물', color: 'text-yellow-500', manaCost: 3 },
      '전기': { power: 8, weakness: '바람', strength: '물', color: 'text-yellow-400', manaCost: 3 },
      '뇌전': { power: 10, weakness: '바람', strength: '물', color: 'text-yellow-600', manaCost: 4 },
      '전광': { power: 9, weakness: '바람', strength: '물', color: 'text-yellow-500', manaCost: 3 },
      
      '땅': { power: 7, weakness: '바람', strength: '번개', color: 'text-amber-700', manaCost: 2 },
      '돌': { power: 6, weakness: '바람', strength: '번개', color: 'text-gray-500', manaCost: 2 },
      '바위': { power: 8, weakness: '바람', strength: '번개', color: 'text-gray-600', manaCost: 3 },
      '철': { power: 9, weakness: '바람', strength: '번개', color: 'text-gray-700', manaCost: 3 },
      '강철': { power: 10, weakness: '바람', strength: '번개', color: 'text-gray-800', manaCost: 4 },
      
      '빛': { power: 8, weakness: '어둠', strength: '어둠', color: 'text-yellow-300', manaCost: 3 },
      '성스러운': { power: 9, weakness: '어둠', strength: '어둠', color: 'text-yellow-200', manaCost: 4 },
      '신성한': { power: 10, weakness: '어둠', strength: '어둠', color: 'text-yellow-100', manaCost: 5 },
      '태양': { power: 11, weakness: '어둠', strength: '어둠', color: 'text-yellow-400', manaCost: 6 },
      
      '어둠': { power: 8, weakness: '빛', strength: '빛', color: 'text-purple-500', manaCost: 3 },
      '암흑': { power: 9, weakness: '빛', strength: '빛', color: 'text-purple-600', manaCost: 4 },
      '저주': { power: 10, weakness: '빛', strength: '빛', color: 'text-purple-700', manaCost: 5 },
      '죽음': { power: 12, weakness: '빛', strength: '빛', color: 'text-purple-800', manaCost: 7 },
      
      // 특수 속성
      '독': { power: 7, weakness: '빛', strength: '생명', color: 'text-green-700', manaCost: 3 },
      '산': { power: 8, weakness: '물', strength: '금속', color: 'text-green-600', manaCost: 3 },
      '생명': { power: 6, weakness: '독', strength: '어둠', color: 'text-green-300', manaCost: 4 },
      '치유': { power: 4, weakness: '독', strength: '어둠', color: 'text-green-200', manaCost: 3 },
      '시간': { power: 15, weakness: '공간', strength: '물질', color: 'text-purple-300', manaCost: 8 },
      '공간': { power: 15, weakness: '시간', strength: '물질', color: 'text-blue-300', manaCost: 8 },
      '정신': { power: 10, weakness: '물질', strength: '시간', color: 'text-pink-400', manaCost: 5 },
      '환상': { power: 9, weakness: '빛', strength: '정신', color: 'text-pink-500', manaCost: 4 }
    },
    forms: {
      // 기본 형태 (마나 비용 대폭 감소)
      '구체': { power: 3, type: 'projectile', speed: 7, range: 'medium', manaCost: 1 },
      '볼': { power: 3, type: 'projectile', speed: 7, range: 'medium', manaCost: 1 },
      '공': { power: 2, type: 'projectile', speed: 8, range: 'medium', manaCost: 1 },
      
      '창': { power: 8, type: 'projectile', speed: 6, range: 'long', manaCost: 2 },
      '스피어': { power: 8, type: 'projectile', speed: 6, range: 'long', manaCost: 2 },
      '작살': { power: 9, type: 'projectile', speed: 5, range: 'long', manaCost: 3 },
      '투창': { power: 7, type: 'projectile', speed: 7, range: 'long', manaCost: 2 },
      
      '검': { power: 10, type: 'melee', speed: 4, range: 'short', manaCost: 3 },
      '칼': { power: 9, type: 'melee', speed: 5, range: 'short', manaCost: 3 },
      '도검': { power: 11, type: 'melee', speed: 3, range: 'short', manaCost: 4 },
      '검날': { power: 10, type: 'melee', speed: 4, range: 'short', manaCost: 3 },
      
      '방패': { power: 5, type: 'defense', speed: 2, range: 'self', manaCost: 2 },
      '보호막': { power: 6, type: 'defense', speed: 3, range: 'self', manaCost: 2 },
      '장벽': { power: 7, type: 'defense', speed: 1, range: 'area', manaCost: 3 },
      '벽': { power: 8, type: 'defense', speed: 1, range: 'area', manaCost: 3 },
      
      '화살': { power: 5, type: 'projectile', speed: 9, range: 'long', manaCost: 2 },
      '화살촉': { power: 6, type: 'projectile', speed: 8, range: 'long', manaCost: 2 },
      '탄환': { power: 7, type: 'projectile', speed: 10, range: 'long', manaCost: 2 },
      
      '폭발': { power: 12, type: 'area', speed: 3, range: 'area', manaCost: 4 },
      '폭탄': { power: 13, type: 'area', speed: 2, range: 'area', manaCost: 5 },
      '터짐': { power: 11, type: 'area', speed: 4, range: 'area', manaCost: 4 },
      
      '회오리': { power: 9, type: 'area', speed: 5, range: 'area', manaCost: 3 },
      '소용돌이': { power: 10, type: 'area', speed: 4, range: 'area', manaCost: 4 },
      '토네이도': { power: 11, type: 'area', speed: 3, range: 'area', manaCost: 5 },
      
      // 특수 형태
      '채찍': { power: 7, type: 'melee', speed: 6, range: 'medium', manaCost: 2 },
      '망치': { power: 12, type: 'melee', speed: 2, range: 'short', manaCost: 4 },
      '도끼': { power: 11, type: 'melee', speed: 3, range: 'short', manaCost: 4 },
      '낫': { power: 10, type: 'melee', speed: 4, range: 'medium', manaCost: 3 },
      
      '덫': { power: 6, type: 'trap', speed: 1, range: 'area', manaCost: 3 },
      '감옥': { power: 8, type: 'control', speed: 2, range: 'target', manaCost: 4 },
      '사슬': { power: 7, type: 'control', speed: 3, range: 'medium', manaCost: 3 },
      '밧줄': { power: 5, type: 'control', speed: 4, range: 'medium', manaCost: 2 },
      
      '빔': { power: 9, type: 'projectile', speed: 10, range: 'long', manaCost: 4 },
      '레이저': { power: 10, type: 'projectile', speed: 10, range: 'long', manaCost: 5 },
      '광선': { power: 8, type: 'projectile', speed: 9, range: 'long', manaCost: 3 },
      
      '구름': { power: 6, type: 'area', speed: 2, range: 'area', manaCost: 3 },
      '안개': { power: 4, type: 'area', speed: 3, range: 'area', manaCost: 2 },
      '비': { power: 5, type: 'area', speed: 4, range: 'area', manaCost: 2 },
      '눈': { power: 4, type: 'area', speed: 3, range: 'area', manaCost: 2 }
    },
    modifiers: {
      // 크기 수식어 (마나 비용 대폭 감소)
      '거대한': { powerMult: 1.8, speedMult: 0.6, description: '크기가 매우 큰', manaCost: 3 },
      '큰': { powerMult: 1.4, speedMult: 0.8, description: '크기가 큰', manaCost: 2 },
      '작은': { powerMult: 0.7, speedMult: 1.3, description: '크기가 작은', manaCost: 0 },
      '미세한': { powerMult: 0.5, speedMult: 1.6, description: '크기가 매우 작은', manaCost: 0 },
      '초대형': { powerMult: 2.2, speedMult: 0.4, description: '크기가 초대형인', manaCost: 5 },
      
      // 속도 수식어
      '빠른': { powerMult: 0.8, speedMult: 1.8, description: '속도가 빠른', manaCost: 1 },
      '신속한': { powerMult: 0.9, speedMult: 1.6, description: '속도가 신속한', manaCost: 2 },
      '느린': { powerMult: 1.3, speedMult: 0.7, description: '속도가 느린', manaCost: 0 },
      '번개같은': { powerMult: 0.7, speedMult: 2.0, description: '번개처럼 빠른', manaCost: 3 },
      '순간의': { powerMult: 0.6, speedMult: 2.2, description: '순간적인', manaCost: 4 },
      
      // 강도 수식어
      '강력한': { powerMult: 1.6, speedMult: 0.9, description: '위력이 강한', manaCost: 2 },
      '약한': { powerMult: 0.6, speedMult: 1.2, description: '위력이 약한', manaCost: 0 },
      '치명적인': { powerMult: 2.0, speedMult: 0.8, description: '치명적인', manaCost: 4 },
      '파괴적인': { powerMult: 1.9, speedMult: 0.7, description: '파괴적인', manaCost: 4 },
      '무시무시한': { powerMult: 1.7, speedMult: 0.8, description: '무시무시한', manaCost: 3 },
      
      // 형태 수식어
      '날카로운': { powerMult: 1.4, speedMult: 1.2, description: '날카로운', manaCost: 2 },
      '뾰족한': { powerMult: 1.3, speedMult: 1.1, description: '뾰족한', manaCost: 1 },
      '둥근': { powerMult: 0.9, speedMult: 1.1, description: '둥근', manaCost: 0 },
      '뒤틀린': { powerMult: 1.2, speedMult: 0.9, description: '뒤틀린', manaCost: 1 },
      '곡선의': { powerMult: 1.1, speedMult: 1.0, description: '곡선의', manaCost: 1 },
      
      // 상태 수식어
      '작열하는': { powerMult: 1.5, speedMult: 1.0, description: '작열하는', manaCost: 2 },
      '얼어붙은': { powerMult: 1.3, speedMult: 0.8, description: '얼어붙은', manaCost: 2 },
      '끓어오르는': { powerMult: 1.4, speedMult: 1.1, description: '끓어오르는', manaCost: 2 },
      '타오르는': { powerMult: 1.6, speedMult: 0.9, description: '타오르는', manaCost: 3 },
      '썩은': { powerMult: 1.2, speedMult: 0.7, description: '썩은', manaCost: 1 },
      '독성의': { powerMult: 1.3, speedMult: 0.8, description: '독성의', manaCost: 2 },
      
      // 질감 수식어
      '투명한': { powerMult: 1.1, speedMult: 1.4, description: '투명한', manaCost: 2 },
      '반투명한': { powerMult: 1.0, speedMult: 1.2, description: '반투명한', manaCost: 1 },
      '불투명한': { powerMult: 1.2, speedMult: 0.9, description: '불투명한', manaCost: 1 },
      '흐릿한': { powerMult: 0.9, speedMult: 1.1, description: '흐릿한', manaCost: 1 },
      '선명한': { powerMult: 1.1, speedMult: 1.0, description: '선명한', manaCost: 1 },
      
      // 패턴 수식어
      '연속된': { powerMult: 1.4, speedMult: 1.2, description: '연속된', manaCost: 2 },
      '다중의': { powerMult: 1.5, speedMult: 0.9, description: '다중의', manaCost: 3 },
      '단일의': { powerMult: 1.2, speedMult: 1.1, description: '단일의', manaCost: 1 },
      '폭발하는': { powerMult: 1.8, speedMult: 0.7, description: '폭발하는', manaCost: 4 },
      '분열하는': { powerMult: 1.3, speedMult: 1.0, description: '분열하는', manaCost: 3 },
      
      // 색상 수식어
      '붉은': { powerMult: 1.2, speedMult: 1.0, description: '붉은색의', manaCost: 1 },
      '푸른': { powerMult: 1.1, speedMult: 1.1, description: '푸른색의', manaCost: 1 },
      '노란': { powerMult: 1.0, speedMult: 1.2, description: '노란색의', manaCost: 1 },
      '검은': { powerMult: 1.3, speedMult: 0.9, description: '검은색의', manaCost: 1 },
      '흰': { powerMult: 1.1, speedMult: 1.0, description: '흰색의', manaCost: 1 },
      '보라': { powerMult: 1.2, speedMult: 0.95, description: '보라색의', manaCost: 1 },
      '초록': { powerMult: 1.0, speedMult: 1.1, description: '초록색의', manaCost: 1 },
      '금색': { powerMult: 1.4, speedMult: 0.9, description: '금색의', manaCost: 2 },
      '은색': { powerMult: 1.2, speedMult: 1.0, description: '은색의', manaCost: 2 },
      
      // 특수 수식어
      '저주받은': { powerMult: 1.7, speedMult: 0.8, description: '저주받은', manaCost: 4 },
      '축복받은': { powerMult: 1.6, speedMult: 1.1, description: '축복받은', manaCost: 4 },
      '신성한': { powerMult: 1.8, speedMult: 1.0, description: '신성한', manaCost: 5 },
      '사악한': { powerMult: 1.5, speedMult: 0.9, description: '사악한', manaCost: 3 },
      '고대의': { powerMult: 1.9, speedMult: 0.7, description: '고대의', manaCost: 6 },
      '전설의': { powerMult: 2.1, speedMult: 0.8, description: '전설의', manaCost: 7 },
      '금지된': { powerMult: 2.3, speedMult: 0.6, description: '금지된', manaCost: 8 },
      
      // 감정 수식어
      '분노의': { powerMult: 1.5, speedMult: 1.2, description: '분노의', manaCost: 2 },
      '슬픔의': { powerMult: 1.2, speedMult: 0.8, description: '슬픔의', manaCost: 2 },
      '기쁨의': { powerMult: 1.1, speedMult: 1.3, description: '기쁨의', manaCost: 1 },
      '절망의': { powerMult: 1.7, speedMult: 0.7, description: '절망의', manaCost: 4 },
      '희망의': { powerMult: 1.3, speedMult: 1.1, description: '희망의', manaCost: 2 }
    },
    // 특수 조합 보너스
    combos: {
      '불+검': { powerBonus: 3, speedBonus: 1, description: '화염검 효과' },
      '얼음+창': { powerBonus: 2, speedBonus: 2, description: '빙창 효과' },
      '번개+화살': { powerBonus: 1, speedBonus: 4, description: '뇌전화살 효과' },
      '어둠+낫': { powerBonus: 4, speedBonus: 0, description: '죽음의 낫 효과' },
      '빛+방패': { powerBonus: 2, speedBonus: 1, description: '성스러운 방어 효과' },
      '폭풍+회오리': { powerBonus: 3, speedBonus: 2, description: '폭풍우 효과' },
      '용암+폭발': { powerBonus: 5, speedBonus: -1, description: '화산 폭발 효과' }
    }
  };

  const npcSpells = [
    // 기본 주문
    '얼음 창', '불 구체', '번개 검', '바람 방패', '돌 망치', '물 화살',
    
    // 중급 주문
    '거대한 용암 폭발', '날카로운 번개 창', '작열하는 불 검', '투명한 얼음 벽',
    '빠른 바람 회오리', '강력한 땅 주먹', '신속한 빛 빔', '어둠 사슬',
    
    // 고급 주문
    '치명적인 저주받은 어둠의 낫', '전설의 태양 광선', '거대한 얼어붙은 빙하 폭발',
    '연속된 번개 화살', '폭발하는 용암 구체', '투명한 바람 칼날',
    
    // 특수 주문
    '금지된 죽음의 검', '축복받은 성스러운 방패', '분노의 불꽃 폭풍',
    '시간의 정지 구슬', '공간의 균열 창', '생명의 치유 빛',
    
    // 색상 주문
    '푸른 얼음 창', '붉은 화염 폭발', '금색 빛 검', '보라 어둠 구름',
    '은색 바람 화살', '검은 저주 사슬', '흰 치유 구체',
    
    // 감정 주문
    '분노의 불꽃 회오리', '슬픔의 물 방울', '절망의 어둠 안개',
    '기쁨의 빛 폭발', '희망의 치유 빔',
    
    // 복잡한 조합 주문
    '거대한 작열하는 붉은 용암 도끼', '빠른 투명한 얼음 바늘',
    '연속된 날카로운 번개 검날', '폭발하는 어둠 독 구름',
    '치명적인 고대의 저주 망치', '신성한 금색 빛 방패 벽',
    
    // 특수 효과 주문
    '분열하는 다중 화살', '뒤틀린 공간 균열', '끓어오르는 산 비',
    '썩은 독 안개', '반투명한 환상 검', '무시무시한 죽음 광선'
  ];

  // 마나 계산 함수 (버그 수정)
  const calculateManaCost = (spell) => {
    if (!spell || !spell.trim()) return 0;
    
    const words = spell.trim().split(/\s+/);
    let totalCost = 0;
    let wordCount = 0;
    
    words.forEach(word => {
      if (!word.trim()) return; // 빈 단어 스킵
      
      const cleanWord = word.replace(/[의를이가은는로으로에서으로서처럼같은]+$/, '');
      
      if (magicData.elements[cleanWord]) {
        totalCost += magicData.elements[cleanWord].manaCost || 0;
        wordCount++;
      } else if (magicData.forms[cleanWord]) {
        totalCost += magicData.forms[cleanWord].manaCost || 0;
        wordCount++;
      } else if (magicData.modifiers[cleanWord]) {
        totalCost += magicData.modifiers[cleanWord].manaCost || 0;
        wordCount++;
      } else {
        // 인식되지 않은 단어는 기본 1 마나
        totalCost += 1;
        wordCount++;
      }
    });
    
    // 복잡도 추가 비용 (5단어 이상일 때)
    if (wordCount >= 5) {
      totalCost += (wordCount - 4) * 1;
    }
    
    return Math.max(1, totalCost);
  };

  // 실시간 마나 계산 (버그 수정)
  const handleSpellChange = (value) => {
    setPlayerSpell(value);
    const estimatedCost = calculateManaCost(value);
    setEstimatedMP(isNaN(estimatedCost) ? 0 : estimatedCost);
  };

  // 주문 분석 함수 (빈 입력 처리 개선)
  const analyzeSpell = (spell) => {
    if (!spell || !spell.trim()) {
      return {
        spell: '',
        power: 0,
        speed: 0,
        elements: [],
        forms: [],
        modifiers: [],
        complexity: 0,
        type: 'none',
        range: 'none',
        specialEffects: [],
        basePower: 0,
        baseSpeed: 0,
        powerMultiplier: 1,
        speedMultiplier: 1,
        comboPower: 0,
        comboSpeed: 0,
        comboDescription: '',
        manaCost: 0,
        efficiency: 0
      };
    }
    
    const words = spell.trim().split(/\s+/);
    let basePower = 0;
    let baseSpeed = 0;
    let elements = [];
    let forms = [];
    let modifiers = [];
    let spellType = 'attack';
    let range = 'medium';
    
    // 1단계: 기본 요소 식별 및 기본 스탯 계산
    words.forEach(word => {
      if (!word.trim()) return; // 빈 단어 스킵
      
      // 조사 제거
      const cleanWord = word.replace(/[의를이가은는로으로에서으로서처럼같은]+$/, '');
      
      if (magicData.elements[cleanWord]) {
        elements.push(cleanWord);
        basePower += magicData.elements[cleanWord].power || 0;
        baseSpeed += 3; // 속성 기본 속도
      } else if (magicData.forms[cleanWord]) {
        forms.push(cleanWord);
        basePower += magicData.forms[cleanWord].power || 0;
        baseSpeed += magicData.forms[cleanWord].speed || 0;
        range = magicData.forms[cleanWord].range || 'medium';
        if (magicData.forms[cleanWord].type === 'defense') {
          spellType = 'defense';
        } else if (magicData.forms[cleanWord].type === 'control') {
          spellType = 'control';
        }
      } else if (magicData.modifiers[cleanWord]) {
        modifiers.push(cleanWord);
      }
    });
    
    // 2단계: 수식어 배수 적용
    let powerMultiplier = 1;
    let speedMultiplier = 1;
    
    modifiers.forEach(modifier => {
      const mod = magicData.modifiers[modifier];
      if (mod) {
        powerMultiplier *= (mod.powerMult || 1);
        speedMultiplier *= (mod.speedMult || 1);
      }
    });
    
    // 3단계: 조합 보너스 계산
    let comboPower = 0;
    let comboSpeed = 0;
    let comboDescription = '';
    
    elements.forEach(element => {
      forms.forEach(form => {
        const comboKey = `${element}+${form}`;
        if (magicData.combos[comboKey]) {
          const combo = magicData.combos[comboKey];
          comboPower += combo.powerBonus || 0;
          comboSpeed += combo.speedBonus || 0;
          comboDescription = combo.description || '';
        }
      });
    });
    
    // 4단계: 복잡도 보너스 계산
    const complexity = words.length;
    const complexityPowerBonus = Math.floor(complexity * 0.8);
    const complexitySpeedBonus = Math.floor(complexity * 0.3);
    
    // 5단계: 최종 계산
    const finalPower = Math.max(0, 
      Math.floor((basePower * powerMultiplier) + comboPower + complexityPowerBonus)
    );
    const finalSpeed = Math.max(0, 
      Math.floor((baseSpeed * speedMultiplier) + comboSpeed + complexitySpeedBonus)
    );
    
    // 마나 비용 계산
    const manaCost = calculateManaCost(spell);
    
    // 효율성 계산 (0으로 나누기 방지)
    const efficiency = manaCost > 0 ? (finalPower / manaCost).toFixed(2) : '0.00';
    
    // 6단계: 특수 효과 계산
    const specialEffects = [];
    
    if (spellType === 'defense') {
      specialEffects.push('방어 보너스');
    }
    
    if (comboDescription) {
      specialEffects.push(comboDescription);
    }
    
    if (finalPower >= 50) {
      specialEffects.push('압도적 위력');
    } else if (finalPower >= 30) {
      specialEffects.push('강력한 위력');
    }
    
    if (finalSpeed >= 40) {
      specialEffects.push('번개 속도');
    } else if (finalSpeed >= 25) {
      specialEffects.push('빠른 속도');
    }
    
    return {
      spell,
      power: finalPower,
      speed: finalSpeed,
      elements,
      forms,
      modifiers,
      complexity,
      type: spellType,
      range,
      specialEffects,
      basePower,
      baseSpeed,
      powerMultiplier,
      speedMultiplier,
      comboPower,
      comboSpeed,
      comboDescription,
      manaCost,
      efficiency
    };
  };

  // 개선된 전투 결과 계산 (빈 입력 처리)
  const calculateBattle = (playerAnalysis, npcAnalysis) => {
    if (!playerAnalysis || !npcAnalysis) return null;
    
    // 플레이어가 빈 주문을 입력한 경우 자동 패배
    if (!playerAnalysis.spell || !playerAnalysis.spell.trim() || playerAnalysis.power === 0) {
      return {
        result: 'perfect_lose',
        playerPower: 0,
        npcPower: npcAnalysis.power,
        totalAdvantage: 0,
        elementAdvantage: 0,
        typeAdvantage: 0,
        rangeAdvantage: 0,
        speedAdvantage: 0,
        complexityAdvantage: 0,
        specialAdvantage: 0,
        advantageDetails: ['빈 주문으로 인한 자동 패배']
      };
    }
    
    let playerPower = playerAnalysis.power;
    let npcPower = npcAnalysis.power;
    let playerSpeed = playerAnalysis.speed;
    let npcSpeed = npcAnalysis.speed;
    
    // 1단계: 속성 상성 계산
    let elementAdvantage = 0;
    let advantageDetails = [];
    
    playerAnalysis.elements.forEach(playerElement => {
      npcAnalysis.elements.forEach(npcElement => {
        const playerElementData = magicData.elements[playerElement];
        if (playerElementData && playerElementData.strength === npcElement) {
          elementAdvantage += 8;
          advantageDetails.push(`${playerElement}이 ${npcElement}에 유리`);
        } else if (playerElementData && playerElementData.weakness === npcElement) {
          elementAdvantage -= 8;
          advantageDetails.push(`${playerElement}이 ${npcElement}에 불리`);
        }
      });
    });
    
    // 2단계: 타입별 상성 계산
    let typeAdvantage = 0;
    
    if (playerAnalysis.type === 'attack' && npcAnalysis.type === 'defense') {
      if (playerPower > npcPower * 1.2) {
        typeAdvantage += 5;
        advantageDetails.push('방어를 뚫었습니다');
      } else {
        typeAdvantage -= 8;
        advantageDetails.push('방어에 막혔습니다');
      }
    } else if (playerAnalysis.type === 'defense' && npcAnalysis.type === 'attack') {
      if (playerPower * 1.2 > npcPower) {
        typeAdvantage += 8;
        advantageDetails.push('성공적으로 방어했습니다');
      } else {
        typeAdvantage -= 3;
        advantageDetails.push('방어가 부족했습니다');
      }
    } else if (playerAnalysis.type === 'control') {
      if (playerSpeed > npcSpeed) {
        typeAdvantage += 6;
        advantageDetails.push('성공적으로 제어했습니다');
      } else {
        typeAdvantage -= 4;
        advantageDetails.push('제어에 실패했습니다');
      }
    }
    
    // 3단계: 범위 상성 계산
    let rangeAdvantage = 0;
    
    if (playerAnalysis.range === 'long' && npcAnalysis.range === 'short') {
      rangeAdvantage += 3;
      advantageDetails.push('사거리 우위');
    } else if (playerAnalysis.range === 'short' && npcAnalysis.range === 'long') {
      rangeAdvantage -= 3;
      advantageDetails.push('사거리 열세');
    } else if (playerAnalysis.range === 'area' && npcAnalysis.range !== 'area') {
      rangeAdvantage += 2;
      advantageDetails.push('범위 공격 우위');
    }
    
    // 4단계: 속도 보너스 계산
    let speedAdvantage = 0;
    const speedDiff = playerSpeed - npcSpeed;
    
    if (speedDiff > 10) {
      speedAdvantage += 5;
      advantageDetails.push('압도적 속도');
    } else if (speedDiff > 5) {
      speedAdvantage += 3;
      advantageDetails.push('속도 우위');
    } else if (speedDiff < -10) {
      speedAdvantage -= 5;
      advantageDetails.push('속도 열세');
    } else if (speedDiff < -5) {
      speedAdvantage -= 3;
      advantageDetails.push('속도 부족');
    }
    
    // 5단계: 복잡도 보너스
    let complexityAdvantage = 0;
    const complexityDiff = playerAnalysis.complexity - npcAnalysis.complexity;
    
    if (complexityDiff > 3) {
      complexityAdvantage += 4;
      advantageDetails.push('복잡한 주문');
    } else if (complexityDiff > 1) {
      complexityAdvantage += 2;
      advantageDetails.push('정교한 주문');
    } else if (complexityDiff < -3) {
      complexityAdvantage -= 2;
      advantageDetails.push('단순한 주문');
    }
    
    // 6단계: 특수 효과 보너스
    let specialAdvantage = 0;
    
    if (playerAnalysis.specialEffects.includes('압도적 위력')) {
      specialAdvantage += 6;
      advantageDetails.push('압도적 위력 발동');
    } else if (playerAnalysis.specialEffects.includes('강력한 위력')) {
      specialAdvantage += 3;
      advantageDetails.push('강력한 위력 발동');
    }
    
    if (playerAnalysis.specialEffects.includes('번개 속도')) {
      specialAdvantage += 4;
      advantageDetails.push('번개 속도 발동');
    } else if (playerAnalysis.specialEffects.includes('빠른 속도')) {
      specialAdvantage += 2;
      advantageDetails.push('빠른 속도 발동');
    }
    
    if (playerAnalysis.comboDescription) {
      specialAdvantage += 3;
      advantageDetails.push(playerAnalysis.comboDescription);
    }
    
    // 7단계: 최종 계산
    const totalAdvantage = elementAdvantage + typeAdvantage + rangeAdvantage + 
                          speedAdvantage + complexityAdvantage + specialAdvantage;
    
    const finalPlayerPower = Math.max(0, playerPower + totalAdvantage);
    const finalNpcPower = npcPower;
    
    // 8단계: 결과 판정
    let result;
    const powerDiff = finalPlayerPower - finalNpcPower;
    
    if (powerDiff > 15) {
      result = 'perfect_win';
    } else if (powerDiff > 5) {
      result = 'win';
    } else if (powerDiff > 0) {
      result = 'narrow_win';
    } else if (powerDiff > -5) {
      result = 'narrow_lose';
    } else if (powerDiff > -15) {
      result = 'lose';
    } else {
      result = 'perfect_lose';
    }
    
    return {
      result,
      playerPower: finalPlayerPower,
      npcPower: finalNpcPower,
      totalAdvantage,
      elementAdvantage,
      typeAdvantage,
      rangeAdvantage,
      speedAdvantage,
      complexityAdvantage,
      specialAdvantage,
      advantageDetails
    };
  };

  // 게임 시작
  const startGame = () => {
    setGameState('playing');
    setPlayerSpell('');
    setEstimatedMP(0);
    setTimeLeft(10);
    
    // NPC 주문 선택
    const randomSpell = npcSpells[Math.floor(Math.random() * npcSpells.length)];
    setNpcSpell(randomSpell);
    setNpcAnalysis(analyzeSpell(randomSpell));
    
    // 타이머 시작
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 입력 창 포커스
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // 라운드 종료 (마나 계산 버그 수정)
  const endRound = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const playerAnalysis = analyzeSpell(playerSpell);
    const npcAnalysis = analyzeSpell(npcSpell);
    
    // 마나 비용 안전하게 계산
    const manaCost = playerAnalysis ? (playerAnalysis.manaCost || 0) : 0;
    
    // 마나 부족 체크
    if (playerAnalysis && playerAnalysis.spell && playerAnalysis.spell.trim() && manaCost > currentMP) {
      // 마나 부족으로 게임오버
      setGameState('gameover');
      setPlayerAnalysis(playerAnalysis);
      setNpcAnalysis(npcAnalysis);
      return;
    }
    
    // 마나 차감 (NaN 방지)
    if (playerAnalysis && playerAnalysis.spell && playerAnalysis.spell.trim() && !isNaN(manaCost)) {
      setCurrentMP(prev => Math.max(0, prev - manaCost));
    }
    
    setPlayerAnalysis(playerAnalysis);
    setNpcAnalysis(npcAnalysis);
    
    const battle = calculateBattle(playerAnalysis, npcAnalysis);
    setBattleResult(battle);
    
    // 점수 업데이트
    if (battle) {
      if (battle.result === 'perfect_win') {
        setPlayerScore(prev => prev + 3);
      } else if (battle.result === 'win') {
        setPlayerScore(prev => prev + 2);
      } else if (battle.result === 'narrow_win') {
        setPlayerScore(prev => prev + 1);
      } else if (battle.result === 'narrow_lose') {
        setNpcScore(prev => prev + 1);
      } else if (battle.result === 'lose') {
        setNpcScore(prev => prev + 2);
      } else if (battle.result === 'perfect_lose') {
        setNpcScore(prev => prev + 3);
      }
    }
    
    // 마나가 3 이하가 되면 게임오버 (다음 라운드를 위해)
    const remainingMP = currentMP - manaCost;
    if (remainingMP < 3) {
      setGameState('gameover');
    } else {
      setGameState('result');
    }
  };

  // 다음 라운드
  const nextRound = () => {
    // 최소 마나로 다음 라운드 진행 가능한지 체크
    if (currentMP < 3) {
      setGameState('gameover');
      return;
    }
    
    setCurrentRound(prev => prev + 1);
    setGameState('ready');
    setBattleResult(null);
    setPlayerAnalysis(null);
    setNpcAnalysis(null);
    setEstimatedMP(0);
  };

  // 게임 리셋
  const resetGame = () => {
    setCurrentRound(1);
    setPlayerScore(0);
    setNpcScore(0);
    setCurrentMP(100);
    setGameState('ready');
    setBattleResult(null);
    setPlayerAnalysis(null);
    setNpcAnalysis(null);
    setEstimatedMP(0);
    setPlayerSpell('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // 엔터 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      endRound();
    }
  };

  // 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* 게임 헤더 */}
      <div className="bg-black/30 border-b border-purple-500/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 flex items-center justify-center gap-3">
              <Zap className="text-yellow-400 w-12 h-12" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                마법 주문 타이핑 게임
              </span>
              <Star className="text-blue-400 w-12 h-12" />
            </h1>
            <p className="text-xl opacity-80 mb-4">창의적인 마법 주문으로 NPC와 대결하세요!</p>
          </div>

          {/* 게임 상태 바 */}
          <div className="bg-black/40 rounded-xl p-4 border border-purple-500/20">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold">
                  <span className="text-purple-300">라운드:</span>
                  <span className="text-2xl text-yellow-400 ml-2">{currentRound}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Sword className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-bold">{playerScore}</span>
                </div>
                <span className="text-gray-400">vs</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-bold">{npcScore}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-lg font-bold">
                  <span className="text-cyan-400">{currentMP}</span>
                  <span className="text-gray-400">/100 MP</span>
                </span>
              </div>
            </div>
            
            {/* 마나 바 */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-cyan-300 font-medium">마나 포인트</span>
                <div className="flex items-center gap-4 text-sm">
                  {currentMP <= 10 && (
                    <div className="flex items-center gap-1 text-red-400 font-bold animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                      <span>마나 위험!</span>
                    </div>
                  )}
                  <span className="text-gray-400">
                    완벽승리: 3점 | 승리: 2점 | 아슬승리: 1점
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-600">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    currentMP > 60 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                    currentMP > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    currentMP > 10 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    'bg-gradient-to-r from-red-500 to-red-700 animate-pulse'
                  }`}
                  style={{ width: `${currentMP}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 게임 컨텐츠 */}
      <div className="max-w-6xl mx-auto p-6">
        {/* 게임오버 화면 */}
        {gameState === 'gameover' && (
          <div className="space-y-6">
            <div className="bg-red-900/40 rounded-xl p-8 text-center border border-red-500/50 backdrop-blur-sm">
              <h2 className="text-5xl font-bold mb-4 text-red-400">게임 오버!</h2>
              <div className="text-xl mb-6">
                <p className="mb-2">마나가 부족합니다!</p>
                <p className="text-lg text-gray-300">라운드 {currentRound}에서 게임 종료</p>
              </div>
              
              {/* 최종 결과 */}
              <div className="bg-black/30 rounded-xl p-6 mb-6 border border-gray-600">
                <h3 className="text-3xl font-bold mb-4 text-purple-300">최종 결과</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-6xl font-bold text-blue-400 mb-2">{playerScore}</div>
                    <div className="text-lg text-blue-300">플레이어 점수</div>
                  </div>
                  <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                    <div className="text-6xl font-bold text-red-400 mb-2">{npcScore}</div>
                    <div className="text-lg text-red-300">NPC 점수</div>
                  </div>
                </div>
                <div className="mt-6 text-lg space-y-2">
                  <div>도달 라운드: <span className="font-bold text-yellow-400">{currentRound}</span></div>
                  <div>남은 마나: <span className="font-bold text-cyan-400">{currentMP}MP</span></div>
                  <div>
                    결과: <span className={`font-bold text-2xl ${
                      playerScore > npcScore ? 'text-green-400' :
                      playerScore < npcScore ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {playerScore > npcScore ? '🏆 최종 승리!' :
                       playerScore < npcScore ? '💀 최종 패배!' :
                       '🤝 무승부!'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 마지막 주문 분석 */}
              {playerAnalysis && (
                <div className="bg-black/30 rounded-xl p-4 mb-6 border border-gray-600">
                  <h3 className="text-lg font-bold mb-2 text-orange-300">마지막 시도한 주문</h3>
                  <div className="font-mono text-blue-300 mb-2">"{playerAnalysis.spell || '(빈 주문)'}"</div>
                  <div className="text-red-400">
                    필요 마나: {playerAnalysis.manaCost || 0}MP (보유: {currentMP}MP)
                  </div>
                </div>
              )}

              <button 
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🎮 다시 시작
              </button>
            </div>
          </div>
        )}

        {/* 준비 화면 */}
        {gameState === 'ready' && (
          <div className="text-center">
            <div className="bg-black/30 rounded-xl p-8 mb-6 border border-purple-500/30 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-4 text-purple-300">라운드 {currentRound} 준비!</h2>
              <p className="text-xl mb-6 text-gray-300">10초 안에 창의적인 마법 주문을 입력하세요</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6 text-sm">
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <p className="font-bold text-red-400 mb-2">🔥 기본 속성:</p>
                  <p className="text-gray-300">불, 물, 얼음, 바람, 번개, 땅, 빛, 어둠</p>
                  <p className="font-bold text-red-400 mt-2">⭐ 특수 속성:</p>
                  <p className="text-gray-300">독, 생명, 시간, 공간, 정신 등</p>
                </div>
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                  <p className="font-bold text-orange-400 mb-2">⚔️ 마법 형태:</p>
                  <p className="text-gray-300">구체, 창, 검, 방패, 화살, 폭발, 회오리</p>
                  <p className="font-bold text-orange-400 mt-2">🌟 특수 형태:</p>
                  <p className="text-gray-300">채찍, 덫, 빔, 안개, 사슬 등</p>
                </div>
                <div className="bg-pink-900/20 rounded-lg p-4 border border-pink-500/30">
                  <p className="font-bold text-pink-400 mb-2">✨ 수식어:</p>
                  <p className="text-gray-300">거대한, 작열하는, 빠른, 날카로운</p>
                  <p className="font-bold text-pink-400 mt-2">💎 특수 수식어:</p>
                  <p className="text-gray-300">저주받은, 전설의, 금지된 등</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                  <p className="font-bold text-yellow-400 mb-2">💡 고득점 팁:</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <p>• 속성 + 형태 조합 보너스 활용 (예: 불+검 = 화염검)</p>
                      <p>• 상성 시스템 활용 (불 &gt; 얼음, 물 &gt; 불, 번개 &gt; 물)</p>
                    </div>
                    <div>
                      <p>• 긴 문장일수록 복잡도 보너스 획득</p>
                      <p>• 특수 수식어로 위력 강화</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <p className="font-bold text-red-400 mb-2">⚠️ 마나 시스템:</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <p>• 시작 마나: 100MP (라운드마다 회복되지 않음)</p>
                      <p>• 기본 주문: 3-6MP, 강력한 주문: 10-20MP</p>
                      <p>• 마나 부족 시 게임오버! 효율적 마나 관리가 필수</p>
                    </div>
                    <div>
                      <p className="font-bold text-cyan-300">💎 효율적인 주문 예시:</p>
                      <p>• "불 화살" (4MP, 13위력) - 효율성: 3.25</p>
                      <p>• "빠른 얼음 창" (5MP, 19위력) - 효율성: 3.80</p>
                      <p className="text-red-300">⚠️ "전설의 금지된 죽음의 낫" (22MP)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
              >
                🚀 게임 시작!
              </button>
            </div>
          </div>
        )}

        {/* 플레이 화면 */}
        {gameState === 'playing' && (
          <div className="space-y-6">
            {/* 타이머 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Timer className={`w-8 h-8 ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} />
                <span className={`text-5xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                  {timeLeft}초
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    timeLeft > 6 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    timeLeft > 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-red-700 animate-pulse'
                  }`}
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* NPC 주문 공개 */}
            <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-300">NPC의 주문</h3>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                <div className="font-mono text-2xl text-red-400 mb-2">"{npcSpell}"</div>
                {npcAnalysis && (
                  <div className="text-sm text-gray-300 space-y-1">
                    <div className="flex gap-4">
                      <span>위력: <span className="text-yellow-400 font-bold">{npcAnalysis.power}</span></span>
                      <span>속도: <span className="text-green-400 font-bold">{npcAnalysis.speed}</span></span>
                      <span>마나: <span className="text-cyan-400 font-bold">{npcAnalysis.manaCost}MP</span></span>
                      <span>효율성: <span className="text-purple-400 font-bold">{npcAnalysis.efficiency}</span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 입력 창 */}
            <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-300">마법 주문을 입력하세요:</h3>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    estimatedMP > currentMP ? 'text-red-400 animate-pulse' : 
                    estimatedMP > currentMP * 0.8 ? 'text-yellow-400' : 
                    'text-cyan-400'
                  }`}>
                    예상 마나: {estimatedMP}MP
                  </div>
                  {estimatedMP > currentMP && (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>마나 부족!</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={playerSpell}
                onChange={(e) => handleSpellChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="예: 작열하는 푸른 불꽃의 창"
                className={`w-full p-4 text-xl rounded-lg bg-gray-800/80 border-2 focus:outline-none transition-all duration-300 ${
                  estimatedMP > currentMP ? 
                  'border-red-500 focus:border-red-400 text-red-300' : 
                  'border-purple-500 focus:border-purple-400 text-white'
                } placeholder-gray-400`}
              />
              <div className="flex justify-between items-center mt-3 text-sm">
                <p className="text-gray-400">Enter 키를 눌러 주문을 완성하세요</p>
                {estimatedMP > 0 && playerSpell.trim() && (
                  <div className="text-gray-400">
                    예상 효율성: {analyzeSpell(playerSpell)?.efficiency || '0.00'} 위력/MP
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 결과 화면 */}
        {gameState === 'result' && (
          <div className="space-y-6">
            {/* 전투 결과 */}
            <div className="bg-black/30 rounded-xl p-6 text-center border border-purple-500/30 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-4 text-purple-300">전투 결과</h2>
              {battleResult && (
                <div className={`text-5xl font-bold mb-4 ${
                  battleResult.result === 'perfect_win' ? 'text-green-300' :
                  battleResult.result === 'win' ? 'text-green-400' :
                  battleResult.result === 'narrow_win' ? 'text-green-500' :
                  battleResult.result === 'narrow_lose' ? 'text-red-500' :
                  battleResult.result === 'lose' ? 'text-red-400' :
                  battleResult.result === 'perfect_lose' ? 'text-red-300' :
                  'text-yellow-400'
                }`}>
                  {battleResult.result === 'perfect_win' ? '🏆 완벽한 승리!' :
                   battleResult.result === 'win' ? '🎉 승리!' :
                   battleResult.result === 'narrow_win' ? '😅 아슬아슬한 승리!' :
                   battleResult.result === 'narrow_lose' ? '😰 아슬아슬한 패배!' :
                   battleResult.result === 'lose' ? '😵 패배!' :
                   battleResult.result === 'perfect_lose' ? '💀 완전한 패배!' :
                   '🤝 무승부!'}
                </div>
              )}
              
              {/* 점수 업데이트 */}
              {battleResult && (
                <div className="text-xl mb-4 bg-black/20 rounded-lg p-4">
                  <span className="text-blue-400 font-bold">플레이어 최종 위력: {battleResult.playerPower}</span>
                  <span className="mx-4 text-gray-400">vs</span>
                  <span className="text-red-400 font-bold">NPC 최종 위력: {battleResult.npcPower}</span>
                </div>
              )}
              
              {/* 우위 요소 분석 */}
              {battleResult && battleResult.advantageDetails.length > 0 && (
                <div className="mb-4 bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-cyan-300">전투 분석</h3>
                  <div className="text-sm space-y-1">
                    {battleResult.advantageDetails.map((detail, index) => (
                      <div key={index} className="text-cyan-300">• {detail}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 주문 분석 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 플레이어 */}
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sword className="text-blue-400" />
                  플레이어
                </h3>
                {playerAnalysis ? (
                  <div className="space-y-3">
                    <div className="font-mono text-lg text-blue-300 bg-black/20 rounded p-2">
                      "{playerAnalysis.spell || '(빈 주문)'}"
                    </div>
                    
                    {/* 기본 스탯 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div>위력: <span className="font-bold text-yellow-400">{playerAnalysis.power}</span></div>
                        <div>속도: <span className="font-bold text-green-400">{playerAnalysis.speed}</span></div>
                        <div>마나: <span className="font-bold text-cyan-400">{playerAnalysis.manaCost}MP</span></div>
                      </div>
                      <div className="space-y-1">
                        <div>효율성: <span className="font-bold text-purple-400">{playerAnalysis.efficiency}</span></div>
                        <div>복잡도: <span className="font-bold text-orange-400">{playerAnalysis.complexity}</span></div>
                        <div>타입: <span className="font-bold text-indigo-400">{
                          playerAnalysis.type === 'attack' ? '공격' : 
                          playerAnalysis.type === 'defense' ? '방어' : 
                          playerAnalysis.type === 'none' ? '없음' : '제어'
                        }</span></div>
                      </div>
                    </div>
                    
                    {/* 구성 요소 */}
                    {(playerAnalysis.elements.length > 0 || playerAnalysis.forms.length > 0 || playerAnalysis.modifiers.length > 0) && (
                      <div className="text-sm space-y-1 bg-black/20 rounded p-2">
                        {playerAnalysis.elements.length > 0 && (
                          <div>속성: {playerAnalysis.elements.map(e => 
                            <span key={e} className={`font-bold ${magicData.elements[e]?.color || 'text-white'} mr-1`}>{e}</span>
                          )}</div>
                        )}
                        {playerAnalysis.forms.length > 0 && (
                          <div>형태: <span className="font-bold text-orange-400">{playerAnalysis.forms.join(', ')}</span></div>
                        )}
                        {playerAnalysis.modifiers.length > 0 && (
                          <div>수식어: <span className="font-bold text-pink-400">{playerAnalysis.modifiers.join(', ')}</span></div>
                        )}
                      </div>
                    )}
                    
                    {/* 특수 효과 */}
                    {playerAnalysis.specialEffects.length > 0 && (
                      <div className="text-sm bg-purple-900/20 rounded p-2">
                        <div className="font-bold text-purple-300">특수 효과:</div>
                        {playerAnalysis.specialEffects.map((effect, index) => (
                          <div key={index} className="text-purple-200">• {effect}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400">주문을 입력하지 않았습니다</div>
                )}
              </div>

              {/* NPC */}
              <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="text-red-400" />
                  NPC
                </h3>
                {npcAnalysis && (
                  <div className="space-y-3">
                    <div className="font-mono text-lg text-red-300 bg-black/20 rounded p-2">"{npcAnalysis.spell}"</div>
                    
                    {/* 기본 스탯 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div>위력: <span className="font-bold text-yellow-400">{npcAnalysis.power}</span></div>
                        <div>속도: <span className="font-bold text-green-400">{npcAnalysis.speed}</span></div>
                        <div>마나: <span className="font-bold text-cyan-400">{npcAnalysis.manaCost}MP</span></div>
                      </div>
                      <div className="space-y-1">
                        <div>효율성: <span className="font-bold text-purple-400">{npcAnalysis.efficiency}</span></div>
                        <div>복잡도: <span className="font-bold text-orange-400">{npcAnalysis.complexity}</span></div>
                        <div>타입: <span className="font-bold text-indigo-400">{
                          npcAnalysis.type === 'attack' ? '공격' : 
                          npcAnalysis.type === 'defense' ? '방어' : '제어'
                        }</span></div>
                      </div>
                    </div>
                    
                    {/* 구성 요소 */}
                    <div className="text-sm space-y-1 bg-black/20 rounded p-2">
                      {npcAnalysis.elements.length > 0 && (
                        <div>속성: {npcAnalysis.elements.map(e => 
                          <span key={e} className={`font-bold ${magicData.elements[e]?.color || 'text-white'} mr-1`}>{e}</span>
                        )}</div>
                      )}
                      {npcAnalysis.forms.length > 0 && (
                        <div>형태: <span className="font-bold text-orange-400">{npcAnalysis.forms.join(', ')}</span></div>
                      )}
                      {npcAnalysis.modifiers.length > 0 && (
                        <div>수식어: <span className="font-bold text-pink-400">{npcAnalysis.modifiers.join(', ')}</span></div>
                      )}
                    </div>
                    
                    {/* 특수 효과 */}
                    {npcAnalysis.specialEffects.length > 0 && (
                      <div className="text-sm bg-purple-900/20 rounded p-2">
                        <div className="font-bold text-purple-300">특수 효과:</div>
                        {npcAnalysis.specialEffects.map((effect, index) => (
                          <div key={index} className="text-purple-200">• {effect}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 전투 상세 */}
            {battleResult && (
              <div className="bg-black/30 rounded-xl p-4 border border-gray-600 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3 text-gray-300">전투 상세 분석</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="font-bold text-gray-300 mb-2">우위 요소 분석</div>
                    <div>속성 상성: {battleResult.elementAdvantage > 0 ? '+' : ''}{battleResult.elementAdvantage}</div>
                    <div>타입 상성: {battleResult.typeAdvantage > 0 ? '+' : ''}{battleResult.typeAdvantage}</div>
                    <div>사거리 상성: {battleResult.rangeAdvantage > 0 ? '+' : ''}{battleResult.rangeAdvantage}</div>
                    <div>속도 우위: {battleResult.speedAdvantage > 0 ? '+' : ''}{battleResult.speedAdvantage}</div>
                    <div>복잡도 보너스: {battleResult.complexityAdvantage > 0 ? '+' : ''}{battleResult.complexityAdvantage}</div>
                    <div>특수 효과: {battleResult.specialAdvantage > 0 ? '+' : ''}{battleResult.specialAdvantage}</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-300 mb-2">총 우위 점수</div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {battleResult.totalAdvantage > 0 ? '+' : ''}{battleResult.totalAdvantage}
                    </div>
                    <div className="text-sm text-gray-400">
                      플레이어 기본 위력 {playerAnalysis ? playerAnalysis.power - battleResult.totalAdvantage : 0} + 우위 {battleResult.totalAdvantage} = {battleResult.playerPower}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-center gap-4">
              {currentMP >= 3 ? (
                <button 
                  onClick={nextRound}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ➡️ 다음 라운드
                </button>
              ) : (
                <div className="text-red-400 text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>마나 부족으로 더 이상 진행할 수 없습니다</span>
                  </div>
                  <button 
                    onClick={() => setGameState('gameover')}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    💀 게임 종료
                  </button>
                </div>
              )}
              <button 
                onClick={resetGame}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔄 게임 리셋
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagicTypingGame; 