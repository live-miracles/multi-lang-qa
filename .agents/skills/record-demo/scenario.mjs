// Native <select> popups are not captured by capturePage, so draw a lookalike list
// under the select, glide to the option, then set the real value.
async function pick(d, selSel, value, n = 0) {
    await d.moveTo(selSel);
    await d.js(`(()=>{
      const sel=document.querySelectorAll(${JSON.stringify(selSel)})[${n}]||document.querySelector(${JSON.stringify(selSel)});
      const r=sel.getBoundingClientRect(), cs=getComputedStyle(sel);
      const p=document.createElement('div'); p.id='fake-dd';
      p.style.cssText='position:fixed;z-index:99999;left:'+r.left+'px;top:'+(r.bottom+2)+'px;min-width:'+Math.max(r.width,110)+'px;background:'+cs.backgroundColor+';color:'+cs.color+';border:1px solid '+cs.borderColor+';border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.45);padding:4px;font-size:13px;font-family:'+cs.fontFamily;
      [...sel.options].forEach((o,i)=>{const e=document.createElement('div');e.className='fake-dd-opt';e.dataset.v=o.value;e.textContent=o.textContent;e.style.cssText='padding:4px 10px;border-radius:4px;'+(o.value===sel.value?'background:rgba(128,128,128,.3)':'');p.appendChild(e)});
      p.style.maxHeight='230px';p.style.overflow='hidden';(sel.closest('dialog')||document.body).appendChild(p);
    })()`);
    await d.sleep(700);
    const opt = await d.tag(
        `[...document.querySelectorAll('.fake-dd-opt')].find(e=>e.dataset.v===${JSON.stringify(value)})`,
        'fake-opt',
    );
    await d.moveTo(opt);
    await d.js(`document.getElementById('fake-opt').style.background='rgba(255,140,100,.55)'`);
    await d.sleep(600);
    await d.js(`(()=>{
      document.getElementById('fake-dd').remove();
      const sel=document.querySelectorAll(${JSON.stringify(selSel)})[${n}]||document.querySelector(${JSON.stringify(selSel)});
      sel.value=${JSON.stringify(value)}; sel.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await d.sleep(900);
}

export default async function run(d) {
    d.record.start();
    await d.sleep(1500);
    await d.click('#add-q-btn', { wait: 900 });
    await pick(d, '#edit-q-modal .q-language', 'Spanish');
    await d.type('#edit-q-modal .q-name', 'Sofia');
    await d.type('#edit-q-modal .q-text', '¿Cómo puedo traer más alegría a mi vida diaria?');
    await d.click('#translate-q-btn', { wait: 1500 });
    await d.shot('add-question');
    await d.click('#update-q-btn', { wait: 1500 });

    const star = await d.tag(
        `[...document.querySelectorAll('.question')].pop().querySelectorAll('label.swap')[1]`,
        'demo-star',
    );
    await d.click(star, { wait: 1500 });
    await d.shot('selected');
    // Mark several questions as answered, one after another
    for (const i of [0, 1, 2]) {
        const done = await d.tag(
            `document.querySelectorAll('.question')[${i}].querySelectorAll('label.swap')[0]`,
            'demo-done-' + i,
        );
        await d.click(done, { wait: 1000 });
    }
    await d.shot('answered');

    // Hide / show original text
    const txt = await d.tag(`document.getElementById('show-q-text').closest('label')`, 'demo-txt');
    await d.click(txt, { wait: 1600 });
    await d.shot('original-hidden');
    await d.click(txt, { wait: 1200 });

    // Hide / show completed questions
    const ans = await d.tag(
        `document.getElementById('show-q-answered').closest('label')`,
        'demo-ans',
    );
    await d.click(ans, { wait: 1600 });
    await d.shot('completed-hidden');
    await d.click(ans, { wait: 1400 });

    await d.record.stop();
    d.log(
        JSON.stringify(
            await d.js(
                `({n:document.querySelectorAll('.question').length, text:document.getElementById('show-q-text').checked, ans:document.getElementById('show-q-answered').checked})`,
            ),
        ),
    );
}
