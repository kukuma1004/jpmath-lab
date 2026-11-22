import {chromium} from '@playwright/test';
/** Ephemeral profiles only. Prefer native GPU-backed new headless on Windows. */
export async function launchBrowser(){
 const channel=process.env.BILLIARDS_BROWSER??(process.platform==='win32'?'chrome':'chromium');
 try{return await chromium.launch({channel,headless:true,args:process.platform==='win32'?['--use-angle=d3d11','--enable-gpu']:[]});}
 catch(error){if(process.env.BILLIARDS_BROWSER)throw error;console.warn(`Browser ${channel} unavailable; using bundled Chromium. Check renderer before any FPS claim.`);return chromium.launch({headless:true});}
}
