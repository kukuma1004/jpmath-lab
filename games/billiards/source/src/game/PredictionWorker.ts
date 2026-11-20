import { PhysicsEngine } from '../physics/PhysicsEngine';
import { FIXED_DT } from '../physics/config';
import type { BallState, ShotInput, TableConfig, Vec2 } from '../physics/types';

export interface PredictionRequest { requestId: number; balls: BallState[]; table: TableConfig; shot: ShotInput }
export interface PredictionResponse { requestId: number; paths: { id: string; points: Vec2[] }[] }

self.onmessage = ({ data }: MessageEvent<PredictionRequest>) => {
  const engine = new PhysicsEngine(data.balls, data.table);
  const paths = engine.balls.map(b => ({ id: b.id, points: [{ ...b.position }] }));
  if (engine.strike(data.shot)) {
    for (let i = 0; i < 240 * 10 && !engine.settled; i++) {
      engine.step(FIXED_DT);
      if (i % 6 === 0 || engine.settled) for (let j = 0; j < paths.length; j++) {
        const p = engine.balls[j].position;
        const previous = paths[j].points.at(-1)!;
        if (Math.hypot(p.x - previous.x, p.z - previous.z) > .003) paths[j].points.push({ ...p });
      }
    }
  }
  self.postMessage({ requestId: data.requestId, paths } satisfies PredictionResponse);
};
