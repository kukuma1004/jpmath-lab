// process.py가 만든 파일. 손으로 고치지 않는다.
// 그림 크기와 발 위치(가로 비율). 없는 항목은 코드로 그린 임시 그림을 쓴다.
export interface ArtData {
  chars: Record<string, { w: number; h: number; footX: number; cx: number }>;
  weapons: Record<string, { w: number; h: number }>;
  bgs: Record<string, { w: number; h: number }>;
}
export const ART: ArtData = {"chars": {"general": {"w": 160, "h": 240, "footX": 0.5535, "cx": 0.4713}, "archer": {"w": 177, "h": 240, "footX": 0.553, "cx": 0.492}, "dokkaebi": {"w": 146, "h": 240, "footX": 0.4845, "cx": 0.4703}, "mudang": {"w": 167, "h": 240, "footX": 0.5843, "cx": 0.4715}, "turtle": {"w": 244, "h": 240, "footX": 0.4346, "cx": 0.4351}, "gumiho": {"w": 220, "h": 240, "footX": 0.5916, "cx": 0.4804}}, "weapons": {"general": {"w": 200, "h": 105}, "archer": {"w": 189, "h": 200}, "dokkaebi": {"w": 200, "h": 139}, "mudang": {"w": 200, "h": 189}, "turtle": {"w": 200, "h": 110}, "gumiho": {"w": 200, "h": 159}}, "bgs": {"baekdu": {"w": 1536, "h": 1024}, "sanseong": {"w": 1536, "h": 1024}, "forest": {"w": 1536, "h": 1024}, "cloud": {"w": 1536, "h": 1024}, "underworld": {"w": 1536, "h": 1024}}};
