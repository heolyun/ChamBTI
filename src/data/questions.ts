import type { Question } from '../types/champion'

export const questions: Question[] = [
  {
    id: 'teamfight-role',
    prompt: '한타가 열리면 어떤 역할을 맡고 싶나요?',
    helper: '첫 느낌대로 골라도 괜찮아요. 이 문항은 교전 거리와 역할 선호를 봅니다.',
    options: [
      { id: 'front-engage', label: '앞에서 열어주기', description: '탱킹하면서 먼저 들어가 판을 연다.', delta: { durability: 2, control: 1, range: -2 } },
      { id: 'pick-maker', label: '각 보고 물기', description: '빈틈을 잡아 먼저 한 명을 끊어낸다.', delta: { aggression: 1, mobility: 1, control: 1 } },
      { id: 'backline-dps', label: '뒤에서 안정적으로 딜', description: '안전한 위치에서 화력을 넣는다.', delta: { range: 2, aggression: 1, durability: -1 } },
      { id: 'utility-cover', label: '보호와 보조', description: '아군을 지키고 흐름을 정리한다.', delta: { control: 2, aggression: -1 } },
    ],
  },
  {
    id: 'lane-style',
    prompt: '라인전에서는 어떤 플레이가 더 끌리나요?',
    helper: '초반에 어떤 템포를 선호하는지 반영됩니다.',
    options: [
      { id: 'heavy-trade', label: '강하게 교전 걸기', description: '주도권을 잡고 압박하는 편이 좋다.', delta: { aggression: 2, range: -1 } },
      { id: 'safe-poke', label: '거리 두고 견제', description: '멀리서 포킹하며 안정적으로 이득을 본다.', delta: { range: 2, control: 1 } },
      { id: 'counter-window', label: '실수 기다렸다 응징', description: '상대 빈틈을 보고 정확히 반응한다.', delta: { control: 2, aggression: -1 } },
      { id: 'mobility-pressure', label: '움직임으로 흔들기', description: '발 빠르게 각을 보며 압박한다.', delta: { mobility: 2, aggression: 1 } },
    ],
  },
  {
    id: 'difficulty',
    prompt: '챔피언 난이도는 어느 쪽이 더 좋나요?',
    helper: '입문 난이도부터 하이 리스크 챔피언까지 폭넓게 반영합니다.',
    options: [
      { id: 'simple-solid', label: '쉽고 단단한 편', description: '복잡하지 않고 안정적이면 좋다.', delta: { execution: -2, durability: 1 } },
      { id: 'simple-damage', label: '쉽지만 존재감 있는 딜', description: '쉬운 조작으로도 임팩트가 있으면 좋다.', delta: { execution: -1, aggression: 1, range: 1 } },
      { id: 'balanced-skill', label: '적당한 손맛', description: '연습 보람은 있되 너무 어렵지는 않았으면 좋다.', delta: { execution: 1, mobility: 1 } },
      { id: 'flashy-hard', label: '어려워도 화려하게', description: '손이 가더라도 멋진 플레이가 가능하면 좋다.', delta: { execution: 2, mobility: 1, aggression: 1 } },
    ],
  },
  {
    id: 'movement',
    prompt: '이동기와 포지셔닝 중 더 중요한 건 무엇인가요?',
    helper: '기동성과 안정성 사이의 취향을 확인합니다.',
    options: [
      { id: 'dash-needed', label: '대시나 재진입이 꼭 필요해요', description: '빠르게 들어가고 빠져나오는 맛이 중요하다.', delta: { mobility: 2, execution: 1 } },
      { id: 'some-speed', label: '이속이나 짧은 이동이면 충분', description: '아예 뚜벅이는 답답하다.', delta: { mobility: 1 } },
      { id: 'positioning', label: '자리 잡는 재미가 더 중요해요', description: '포지셔닝과 거리 조절이 핵심이다.', delta: { range: 1, control: 1, mobility: -1 } },
      { id: 'slow-but-strong', label: '느려도 강하면 괜찮아요', description: '묵직한 존재감이 있으면 만족한다.', delta: { durability: 1, aggression: 1, mobility: -2 } },
    ],
  },
  {
    id: 'distance',
    prompt: '기본적으로 싸우는 거리는 어느 쪽이 편한가요?',
    helper: '원거리 선호와 근접 선호를 가장 크게 나누는 질문입니다.',
    options: [
      { id: 'melee', label: '완전 근접', description: '붙어서 압박하는 전투가 재밌다.', delta: { range: -2, durability: 1, aggression: 1 } },
      { id: 'mid-close', label: '근중거리 혼합', description: '상황 따라 붙었다 빠졌다 하는 편이 좋다.', delta: { range: -1, mobility: 1 } },
      { id: 'mid-long', label: '중장거리 주문 교전', description: '스킬샷과 거리 유지 플레이가 좋다.', delta: { range: 1, control: 1 } },
      { id: 'full-range', label: '최대한 멀리서 화력', description: '안전한 거리에서 꾸준히 딜하고 싶다.', delta: { range: 2, aggression: 1 } },
    ],
  },
  {
    id: 'ahead-plan',
    prompt: '게임을 유리하게 가져가면 무엇을 하고 싶나요?',
    helper: '스노우볼 방식과 승리 패턴을 반영합니다.',
    options: [
      { id: 'hunt-kills', label: '계속 킬각 보기', description: '템포를 높여 더 크게 굴리고 싶다.', delta: { aggression: 2, mobility: 1 } },
      { id: 'side-pressure', label: '사이드 압박', description: '개인 기량과 라인 운영으로 흔들고 싶다.', delta: { mobility: 1, execution: 1, aggression: 1 } },
      { id: 'setup-teamfight', label: '오브젝트와 한타 설계', description: '팀 단위 판단으로 굳히는 쪽이 좋다.', delta: { control: 2, durability: 1 } },
      { id: 'safe-snowball', label: '안전하게 이득 굴리기', description: '안정적인 포지션에서 계속 이득을 본다.', delta: { range: 1, control: 1 } },
    ],
  },
  {
    id: 'behind-plan',
    prompt: '반대로 불리할 때는 어떻게 풀고 싶나요?',
    helper: '역전 방식과 안정성을 보는 질문입니다.',
    options: [
      { id: 'force-play', label: '이니시로 변수 만들기', description: '한 번의 진입으로 흐름을 바꾸고 싶다.', delta: { aggression: 1, durability: 1, control: 1 } },
      { id: 'wave-and-poke', label: '포킹과 라인 정리로 버티기', description: '안전하게 시간을 벌며 기회를 본다.', delta: { range: 2, control: 1, aggression: -1 } },
      { id: 'pick-off', label: '픽오프 기회 보기', description: '한 명을 끊어서 균형을 되찾고 싶다.', delta: { mobility: 1, control: 1, execution: 1 } },
      { id: 'protect-team', label: '아군 보호와 유틸 집중', description: '직접 캐리보다 보조 역할로 승부한다.', delta: { control: 2, aggression: -2 } },
    ],
  },
  {
    id: 'payoff',
    prompt: '가장 짜릿한 순간은 어떤 장면인가요?',
    helper: '플레이 만족도가 높은 순간을 중심으로 추천 정확도를 높입니다.',
    options: [
      { id: 'burst-combo', label: '폭딜 콤보가 터질 때', description: '딜이 한 번에 들어가는 손맛이 좋다.', delta: { aggression: 2, execution: 1 } },
      { id: 'sustained-dps', label: '지속 화력이 쌓일 때', description: '포지션 잡고 꾸준히 때리는 그림이 좋다.', delta: { aggression: 1, range: 1 } },
      { id: 'cc-chain', label: 'CC 연계가 깔끔할 때', description: '스킬이 정확히 이어지는 장면이 좋다.', delta: { control: 2 } },
      { id: 'soak-damage', label: '버티면서 중심을 잡을 때', description: '한가운데 서서 받아내는 느낌이 좋다.', delta: { durability: 2 } },
    ],
  },
  {
    id: 'team-identity',
    prompt: '팀에서 어떤 이미지로 기억되고 싶나요?',
    helper: '캐리 성향, 유틸 성향, 플레이메이킹 성향을 살펴봅니다.',
    options: [
      { id: 'hard-carry', label: '게임을 끝내는 캐리', description: '딜과 성장으로 주인공이 되고 싶다.', delta: { aggression: 2, execution: 1 } },
      { id: 'reliable-helper', label: '팀을 살리는 조력자', description: '직접 딜보다 흐름을 정리하는 역할이 좋다.', delta: { control: 2, aggression: -1 } },
      { id: 'engage-leader', label: '싸움을 여는 선봉장', description: '진입 타이밍을 잡는 역할이 재밌다.', delta: { durability: 1, control: 1, aggression: 1 } },
      { id: 'outplay-star', label: '재밌는 아웃플레이 장인', description: '움직임과 손맛으로 장면을 만들고 싶다.', delta: { mobility: 1, execution: 2 } },
    ],
  },
  {
    id: 'result-vibe',
    prompt: '이번 추천 결과는 어떤 느낌이면 좋겠나요?',
    helper: '마지막 문항에서 입문용인지 손맛형인지 톤을 조절합니다.',
    options: [
      { id: 'easy-now', label: '지금 바로 입문 가능한 픽', description: '복잡하지 않고 시작하기 쉬웠으면 좋겠다.', delta: { execution: -2, durability: 1 } },
      { id: 'all-rounder', label: '무난하고 범용적인 픽', description: '어느 정도 상황에 다 잘 맞는 챔피언이 좋다.', delta: { control: 1 } },
      { id: 'growth-feel', label: '연습할수록 손맛이 나는 픽', description: '처음보다 익숙해질수록 재미가 커졌으면 좋겠다.', delta: { execution: 1, aggression: 1 } },
      { id: 'high-risk', label: '하이리스크 하이리턴', description: '어려워도 제대로 터지면 짜릿한 픽이 좋다.', delta: { execution: 2, aggression: 1, durability: -1 } },
    ],
  },
]
