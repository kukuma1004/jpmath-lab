// 화면에 보이는 이름은 여기 한 곳에서만 정한다. 공개 주소(games/cannon-hill)와는 묶지 않는다.
export const GAME_TITLE = '와르르';
export const GAME_SUBTITLE = '고개 너머 포싸움';
export const STORAGE_PREFIX = 'jpml.warureu.';

// 논리 화면. 높이는 720으로 고정하고 가로는 화면 비율에 맞춰 늘린다.
export const VIEW_H = 720;
export const VIEW_W_MIN = 960;
export const VIEW_W_MAX = 1680;

// 시뮬레이션 단위: 1 = 월드 1px. y는 아래로 증가한다.
export const CELL = 2;
export const WORLD_W = 2400;
export const WORLD_H = 1200;
export const COLS = WORLD_W / CELL;
export const ROWS = WORLD_H / CELL;

export const DT = 1 / 60;
export const GRAVITY = 560;
export const MAX_LAUNCH_SPEED = 1100;
export const WIND_ACC_PER_UNIT = 7;
export const WIND_MAX = 10;

export const CHAR_RADIUS = 17;
export const CHAR_CENTER_Y = 20;
export const WALK_SPEED = 104;
export const MOVE_BUDGET = 225;
export const STEP_UP = 24;
export const STEP_DOWN = 14;
export const MAX_LAUNCH_TILT = 18;
export const SAFE_FALL_SPEED = 360;
export const FALL_DAMAGE_PER_SPEED = 0.78;
export const FALL_DAMAGE_MAX = 420;

export const ANGLE_SPEED = 42; // 도/초
export const CHARGE_TIME = 1.6; // 0→100까지 걸리는 시간
export const TURN_TIME_DEFAULT = 30;
export const TURN_LIMIT_DEFAULT = 0;
export const BASE_HP = 800;

export const MAX_BOULDERS = 28;
export const MAX_CHUNKS = 24;
export const SETTLE_LIMIT = 1.6; // 포탄이 끝난 뒤 남은 물리를 빠르게 정착시킨다
export const FLIGHT_LIMIT = 14;
export const MIN_SETTLE_HOLD = 0.18;
