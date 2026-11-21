import Phaser from 'phaser';
import { makeTextures } from '../art/textures';
import { preloadArt } from '../art/artAssets';
import type { App } from '../app';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    // 그림 파일 하나를 못 불러와도 멈추지 않는다(그 자리는 코드로 그린 임시 그림을 쓴다)
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => console.warn('그림을 못 불러옴', file.key));
    preloadArt(this.load);
  }

  create(): void {
    makeTextures(this);
    const app = this.registry.get('app') as App;
    app.onBooted();
    this.scene.start('title');
  }
}
