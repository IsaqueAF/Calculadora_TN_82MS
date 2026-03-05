const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const indexPath = path.join(projectRoot, 'index.html');
const scriptPath = path.join(projectRoot, 'src', 'scripts', 'script.js');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

async function run() {
  const dom = new JSDOM(indexHtml, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;
  // inject script content
  const scriptEl = window.document.createElement('script');
  scriptEl.textContent = scriptContent;
  window.document.body.appendChild(scriptEl);

  // wait for a tick
  await new Promise(r => setTimeout(r, 50));

  const query = sel => window.document.getElementById(sel);

  function click(id) {
    const el = query(id);
    if (!el) throw new Error('Missing element: ' + id);
    el.click();
  }

  // Test 1: basic addition 2 + 3 = 5
  click('2');
  click('plus');
  click('3');
  click('equal');

  await new Promise(r => setTimeout(r, 20));

  const display = query('text__calculate__result').textContent;
  console.log('Display after 2+3=', display.trim());

  // Test 2: Ans stored
  click('Ans');
  await new Promise(r => setTimeout(r, 10));
  console.log('Ans loaded into display:', query('text__calculate__result').textContent.trim());

  // Test 3: DEL behavior
  click('AC');
  click('1'); click('2'); click('3');
  click('DEL');
  await new Promise(r => setTimeout(r, 10));
  console.log('After entering 123 and DEL, display:', query('text__calculate__result').textContent.trim());

  // Test 4: trig functions (radians). enter 0 and sin => 0
  click('AC');
  click('0');
  click('sin');
  await new Promise(r => setTimeout(r, 10));
  console.log('sin(0)=', query('text__calculate__result').textContent.trim());

  // Test 5: STO / RCL
  click('AC');
  click('7');
  click('STO');
  click('AC');
  click('RCL');
  await new Promise(r => setTimeout(r, 10));
  console.log('After STO 7 and RCL, display:', query('text__calculate__result').textContent.trim());

  // Test 6: nCr (compute 5C3 = 10) -> enter 3, press plus (sets secondary=3), enter 5, press nCr
  click('AC');
  click('3');
  click('plus');
  click('5');
  click('nCr');
  await new Promise(r => setTimeout(r, 10));
  console.log('5C3 =', query('text__calculate__result').textContent.trim());

  // Test 7: inv (4 -> 1/4)
  click('AC');
  click('4');
  click('inv');
  await new Promise(r => setTimeout(r, 10));
  console.log('inv(4)=', query('text__calculate__result').textContent.trim());

  // Test 8: ENG (12345 -> mantissa 12.345)
  click('AC');
  click('1'); click('2'); click('3'); click('4'); click('5');
  click('ENG');
  await new Promise(r => setTimeout(r, 10));
  console.log('ENG(12345)=', query('text__calculate__result').textContent.trim());

  // Test 9: hyp toggle and sinh(1)
  click('AC');
  click('1');
  click('hyp');
  click('sin');
  await new Promise(r => setTimeout(r, 10));
  console.log('sinh(1)=', query('text__calculate__result').textContent.trim());

  console.log('All tests executed.');
}

run().catch(err => { console.error(err); process.exit(1); });
