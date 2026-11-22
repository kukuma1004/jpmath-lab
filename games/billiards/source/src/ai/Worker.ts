import { planShot } from './ShotPlanner';
import type { AIRequest } from './types';

self.onmessage=({data}:MessageEvent<AIRequest>)=>self.postMessage(planShot(data));
