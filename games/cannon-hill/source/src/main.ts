import './styles/main.css';
import { App } from './game/app';
import { input } from './game/input/input';

// 모바일 브라우저의 확대·스크롤·길게 누르기 메뉴가 조작을 방해하지 않게
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => {
  if (!(e.target as HTMLElement).closest('.card')) e.preventDefault();
}, { passive: false });
document.addEventListener('touchmove', (e) => {
  if (!(e.target as HTMLElement).closest('.grid, .detail, .sheet, .title, .online-lobby, .target-dialog, .result, input[type=range]')) e.preventDefault();
}, { passive: false });

input.attach();
const app = new App();
app.boot();
(window as unknown as { __app: App }).__app = app;
