import { expect } from 'chai';
import {
  formatVideoName,
  findNamingCase,
  getCaseXInfoObj,
  getCaseAbbrInfoObj,
  getCaseFullInfoObj,
  getSequenceInfo,
  handleVideoRenaming,
  getVideoNamingHash,
  handleSubRenaming,
  format,
} from '../src/format/index.js';
import { generateDummyNames } from '../src/dummy/index.js';
describe('handleVideoRenaming', () => {
  // it('', async () => {
  //   const { videos, subs } = await generateDummyNames(10);
  //   const videosAfterRenaming = await handleVideoRenaming(videos);
  //   const infos = [];
  //   for (let i in videosAfterRenaming) {
  //     infos.push(getSequenceInfo(videosAfterRenaming[i]));
  //   }
  //   let hasError = false;
  //   for (let i = 0; i < videosAfterRenaming.length; i += 1) {
  //     const res = getSequenceInfo(videosAfterRenaming[i]);
  //     if (!res) {
  //       hasError = true;
  //       break;
  //     }
  //     if (!res.season || !res.episode || !res.matches || !res.case) {
  //       hasError = true;
  //       break;
  //     }
  //   }
  //   console.log(infos);
  //   expect(hasError).equal(false);
  // });
  it('Should format successfully', async () => {
    const videos = [
      'Two.and.a.Half.Men.Season 7 Episode 4.WEB DL DD5 1 H264-PeeWee.mkv',
      'Two.and.a.Half.Men.Season 07 Episode 04.WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 7 Episode 4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 07 Episode 04 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S7 E4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S07 E04 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7x4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7X4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7X04 WEB DL DD5 1 H264-PeeWee.mkv',
    ];
    const renamedVideoFiles = await handleVideoRenaming(videos);
    let hasError = false;
    for (let i = 0; i < renamedVideoFiles.length; i += 1) {
      if (renamedVideoFiles[i] !== 'Two.and.a.Half.Men.S07E04.WEB.DL.DD5.1.H264-PeeWee.mkv') {
        hasError = true;
        break;
      }
    }
    console.log(renamedVideoFiles);
    expect(hasError).equal(false);
  });
  it('Should format successfully multiple episodes', async () => {
    const videos = [
      'Two.and.a.Half.Men.Season 7 Episode 4 Episode 5 .WEB DL DD5 1 H264-PeeWee.mkv',
      'Two.and.a.Half.Men.Season 07 Episode 04 Episode 05.WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 7 Episode 4 Episode 5 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 7 Episode 4 & Episode 5 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 07 Episode 04 Episode 05 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S7 E4 E5 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S7E4E5 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S07 E04 E05 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7x4x5 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7X4x5 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7X04x5 WEB DL DD5 1 H264-PeeWee.mkv',
    ];
    const subs = [
      'Two.and.a.Half.Men.Season 7 Episode 4 Episode 5 .WEB DL DD5 1 H264-PeeWee.srt',
      'Two.and.a.Half.Men.Season 07 Episode 04 Episode 05.WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men Season 7 Episode 4 Episode 5 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men Season 7 Episode 4 & Episode 5 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men Season 07 Episode 04 Episode 05 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men S7 E4 E5 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men S7E4E5 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men S07 E04 E05 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 7x4x5 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 7X4x5 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 7X04x5 WEB DL DD5 1 H264-PeeWee.srt',
    ];
    const renamedVideoFiles = await handleVideoRenaming(videos);
    let hasError = false;
    for (let i = 0; i < renamedVideoFiles.length; i += 1) {
      if (renamedVideoFiles[i] !== 'Two.and.a.Half.Men.S07E04E05.WEB.DL.DD5.1.H264-PeeWee.mkv') {
        hasError = true;
        break;
      }
    }
    const fileNamesHash = await getVideoNamingHash(renamedVideoFiles);
    const renamedSubFiles = await handleSubRenaming(subs, fileNamesHash);
    for (let i = 0; i < renamedSubFiles.length; i += 1) {
      if (renamedSubFiles[i] !== 'Two.and.a.Half.Men.S07E04E05.WEB.DL.DD5.1.H264-PeeWee.srt') {
        hasError = true;
        break;
      }
    }
    expect(hasError).equal(false);
  });
  it('Should format successfully episodes', async () => {
    const videos = [
      'Two.and.a.Half.Men.Season 7 Episode 4  .WEB DL DD5 1 H264-PeeWee.mkv',
      'Two.and.a.Half.Men.Season 07 Episode 04 .WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 7 Episode 4  WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 7 Episode 4  WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men Season 07 Episode 04  WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S7 E4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S7E4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men S07 E04 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 07x4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7X4 WEB DL DD5 1 H264-PeeWee.mkv',
      'Two and a Half Men 7X04 WEB DL DD5 1 H264-PeeWee.mkv',
    ];
    const subs = [
      'Two.and.a.Half.Men.Season 07 Episode 04  .WEB DL DD5 1 H264-PeeWee.srt',
      'Two.and.a.Half.Men.Season 07 Episode 04 .WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men Season 7 Episode 4  WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men Season 7 Episode 04  WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men Season 07 Episode 04  WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men S7 E4 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men S7E4 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men S07 E04 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 7x4 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 07x4 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 7X4 WEB DL DD5 1 H264-PeeWee.srt',
      'Two and a Half Men 7X04 WEB DL DD5 1 H264-PeeWee.srt',
    ];
    const renamedVideoFiles = await handleVideoRenaming(videos);
    let hasError = false;
    for (let i = 0; i < renamedVideoFiles.length; i += 1) {
      if (renamedVideoFiles[i] !== 'Two.and.a.Half.Men.S07E04.WEB.DL.DD5.1.H264-PeeWee.mkv') {
        hasError = true;
        break;
      }
    }
    const fileNamesHash = await getVideoNamingHash(renamedVideoFiles);
    const renamedSubFiles = await handleSubRenaming(subs, fileNamesHash);
    for (let i = 0; i < renamedSubFiles.length; i += 1) {
      if (renamedSubFiles[i] !== 'Two.and.a.Half.Men.S07E04.WEB.DL.DD5.1.H264-PeeWee.srt') {
        hasError = true;
        break;
      }
    }
    console.log(renamedVideoFiles);
    console.log(renamedSubFiles);
    expect(hasError).equal(false);
  });
});
