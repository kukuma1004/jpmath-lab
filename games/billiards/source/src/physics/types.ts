export interface Vec2 { x: number; z: number }
export interface Vec3 { x: number; y: number; z: number }
export interface Quaternion { x: number; y: number; z: number; w: number }
export type BallColor = 'white' | 'yellow' | 'red' | 'red2';
export interface BallState {
  id: string;
  color: BallColor;
  position: Vec2;
  velocity: Vec2;
  angularVelocity: Vec3;
  orientation: Quaternion;
}
export interface TableConfig { width: number; height: number; ballRadius: number; ballMass: number }
export interface ShotInput { ballId: string; angle: number; power: number; tip: { x: number; y: number } }
export type PhysicsEvent =
  | { type: 'ball-ball'; time: number; sequence: number; ballA: string; ballB: string; speed: number }
  | { type: 'cushion'; time: number; sequence: number; ballId: string; rail: 'left'|'right'|'top'|'bottom'; speed: number }
  | { type: 'shot'; time: number; sequence: number; ballId: string; speed: number }
  | { type: 'rest'; time: number; sequence: number };
export interface PhysicsSnapshot { balls: BallState[]; time: number }
export interface RuleProfile { id: 'practice'|'four-ball'|'three-cushion'|'eight-ball'; name: string; table: TableConfig }
export interface ShotResult { input: ShotInput; before: PhysicsSnapshot; after: PhysicsSnapshot; events: PhysicsEvent[] }
/** Rule engines consume an ordered physics event stream; no mesh positions are used for scoring. */
export interface RuleEngine { profile: RuleProfile; evaluate(result: ShotResult): { scored: boolean; foul: string | null; retainTurn: boolean } }
