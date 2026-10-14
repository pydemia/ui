import assert from 'node:assert/strict';
import test from 'node:test';
import { planPrismPrintPdfPage, renderPrismProfilePdf } from '../dist/index.js';

function assertBodyRetained(slices,height,header){
    let end=0;
    for(const [index,slice] of slices.entries()){
        const body=slice.parts.at(-1);assert.equal(body[0],end);assert.ok(body[1]>body[0]);end=body[1];
        if(index&&header)assert.deepEqual(slice.parts[0],[0,header]);
        assert.ok(slice.heightMm<=280+.00001);
    }
    assert.equal(end,height);
}
test('A4 continuation repeats only the header and retains every body pixel in order',()=>{
    const slices=planPrismPrintPdfPage({width:190,height:650,headerHeight:40});
    assert.deepEqual(slices.map(s=>s.parts),[[[0,280]],[[0,40],[280,520]],[[0,40],[520,650]]]);
    assertBodyRetained(slices,650,40);assert.ok(slices.every(s=>!s.forcedBreak));
});
test('a fitting card moves intact and a text line is not split at the A4 boundary',()=>{
    const card=planPrismPrintPdfPage({width:190,height:650,headerHeight:40,avoid:[[220,310]]});
    assert.ok(card[0].parts[0][1]<220);assertBodyRetained(card,650,40);
    assert.ok(card.every(s=>!s.forcedBreak));
    const text=planPrismPrintPdfPage({width:190,height:650,lines:[[275,285],[552,562]]});
    assert.ok(text[0].parts[0][1]<275);assertBodyRetained(text,650,0);
    assert.ok(text.every(s=>!s.forcedBreak));
});
test('a long heading block may split on a text line instead of leaving the first page almost blank',()=>{
    const long=planPrismPrintPdfPage({width:190,height:430,keepWithNext:[[60,300]],lines:[[265,285]]});
    assert.ok(long[0].parts[0][1]>=250);
    assert.ok(long[0].parts[0][1]<265);
    assert.equal(long[0].forcedBreak,true);
    assertBodyRetained(long,430,0);
    const short=planPrismPrintPdfPage({width:190,height:430,keepWithNext:[[220,310]],lines:[[265,285]]});
    assert.ok(short[0].parts[0][1]<220);
    assert.equal(short[0].forcedBreak,false);
    assertBodyRetained(short,430,0);
});
test('separate title and tab ranges repeat without repeating the intervening profile photo',()=>{
    const headers=[[0,20],[80,110]];
    const slices=planPrismPrintPdfPage({width:190,height:650,headerParts:headers});
    assert.deepEqual(slices.map(s=>s.parts),[[[0,280]],[[0,20],[80,110],[280,510]],[[0,20],[80,110],[510,650]]]);
    assertBodyRetained(slices,650,0);
    for(const slice of slices.slice(1))assert.deepEqual(slice.parts.slice(0,-1),headers);
    for(const headerParts of [[[0,30],[20,40]],[[20,40],[0,10]],[[0,281]]])assert.throws(()=>planPrismPrintPdfPage({width:190,height:650,headerParts}),RangeError);
});
test('oversized unbreakable content is retained and reported as forced breaks',()=>{
    const slices=planPrismPrintPdfPage({width:190,height:5000,headerHeight:40,avoid:[[0,5000]],lines:[[0,5000]]});
    assertBodyRetained(slices,5000,40);assert.ok(slices.slice(0,-1).every(s=>s.forcedBreak));
    assert.equal(slices.at(-1).forcedBreak,false);
});
test('pagination rejects invalid physical dimensions and intervals rather than looping or dropping content',()=>{
    for(const props of [{width:0,height:1},{width:190,height:1,headerHeight:280},{width:190,height:NaN},{width:190,height:100,lines:[[80,120]]},{width:190,height:100,avoid:[[90,80]]}])
        assert.throws(()=>planPrismPrintPdfPage(props),RangeError);
    const huge=planPrismPrintPdfPage({width:190,height:100000,headerHeight:60});assertBodyRetained(huge,100000,60);
});
test('an already canceled profile render does not need a DOM or create a capture root',async()=>{
    const controller=new AbortController();controller.abort();
    await assert.rejects(renderPrismProfilePdf({id:'synthetic',candidate:{id:'x',name:'가상'}},{signal:controller.signal}),{name:'AbortError'});
});
