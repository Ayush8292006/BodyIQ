/* BodyIQ prototype – plain JavaScript, no build step.
   Phone width  -> mobile app layout (bottom tabs)
   Laptop width -> website layout (sidebar)
   Profile and progress are saved in localStorage. */
(function () {
  'use strict';

  // ---------- Static content ----------
  var GOALS = [
    { id: 'lose', title: 'Lose fat', desc: 'Burn fat and get leaner' },
    { id: 'muscle', title: 'Build muscle', desc: 'Gain size and strength' },
    { id: 'fit', title: 'Stay fit', desc: 'Feel healthy, active and strong' },
    { id: 'gain', title: 'Gain weight', desc: 'Put on healthy mass' }
  ];
  var LEVELS = [
    { id: 'beginner', title: 'Beginner', desc: 'New, or under 6 months of training' },
    { id: 'intermediate', title: 'Intermediate', desc: '6 months to 2 years, trains regularly' },
    { id: 'advanced', title: 'Advanced', desc: '2+ years, follows a training split' }
  ];
  var PLACES = [
    { id: 'gym', title: 'Gym', desc: 'Full equipment, log every set' },
    { id: 'home', title: 'Home', desc: 'Bodyweight or basic equipment' },
    { id: 'both', title: 'Both', desc: 'Mix of gym days and home days' }
  ];
  var DIETS = [
    { id: 'veg', title: 'Vegetarian', desc: 'No meat, fish or eggs' },
    { id: 'eggs', title: 'Eggetarian', desc: 'Vegetarian plus eggs' },
    { id: 'nonveg', title: 'Non-vegetarian', desc: 'Includes chicken, fish and eggs' },
    { id: 'vegan', title: 'Vegan', desc: 'No animal products' }
  ];
  var STEPS = ['welcome', 'name', 'body', 'goal', 'level', 'place', 'diet', 'plan'];
  var TITLES = {
    name: ['What should we call you?', 'This helps us personalise your plan.'],
    body: ['Your body details', 'Used to work out your calories and BMI.'],
    goal: ['What is your main goal?', 'You can change this any time.'],
    level: ['How experienced are you?', 'We match exercises and volume to your level.'],
    place: ['Where will you train?', 'And how many days a week can you commit?'],
    diet: ['Your diet preference', 'Your meal plan will only use these foods.']
  };
  var ROUTINES = [
    { name: 'Push Day', meta: 'Chest, shoulders, triceps · 6 exercises' },
    { name: 'Pull Day', meta: 'Back, biceps · 6 exercises' },
    { name: 'Leg Day', meta: 'Quads, hamstrings, calves · 5 exercises' },
    { name: 'Home Full Body', meta: 'No equipment · 20 min' }
  ];
  var PLAN = [
    ['Bench Press', '3 × 6–10'], ['Incline Dumbbell Press', '3 × 10'], ['Cable Fly', '3 × 12'],
    ['Overhead Press', '3 × 8'], ['Tricep Rope Pushdown', '3 × 12']
  ];
  var PROGRAMS = [
    { level: 'Beginner', name: 'Full Body Burn', time: '20 min', meta: '8 moves · no equipment', dark: true },
    { level: 'All levels', name: 'Core Crusher', time: '15 min', meta: '6 moves · mat only' },
    { level: 'Intermediate', name: 'HIIT Fat Loss', time: '25 min', meta: '10 rounds · 40s on / 20s off' },
    { level: 'Beginner', name: 'Mobility Reset', time: '12 min', meta: 'Stretch and recover' }
  ];
  var MEALS = [
    { short: 'BF', name: 'Breakfast', items: 'Poha, masala chai', kcal: 320 },
    { short: 'LN', name: 'Lunch', items: 'Dal, 2 roti, paneer sabzi', kcal: 610 },
    { short: 'SN', name: 'Snacks', items: 'Greek yogurt, almonds', kcal: 490 },
    { short: 'DN', name: 'Dinner', items: 'Suggested: grilled paneer, rice', kcal: 0 }
  ];
  var PRS = [['Bench Press', 'Today', '77.5 kg'], ['Back Squat', '21 Oct', '110 kg'], ['Deadlift', '14 Oct', '140 kg']];
  var STEP_WEEK = [['Wed', 9120], ['Thu', 10450], ['Fri', 7330], ['Sat', 8840], ['Sun', 6210], ['Mon', 7690], ['Tue', 6840]];
  var EATEN = { kcal: 1420, protein: 92, carbs: 160, fat: 41 };
  var STEPS_TODAY = 6840;

  // ---------- Icons ----------
  function svg(p, w) { return '<svg width="' + (w || 20) + '" height="' + (w || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var I = {
    home: svg('<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    workout: svg('<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3.5 9v6"/><path d="M20.5 9v6"/><path d="M6.5 12h11"/>'),
    diet: svg('<path d="M7 2v9a3 3 0 0 0 3 0V2"/><path d="M8.5 11v11"/><path d="M17 2c-2 2-3 4.5-3 8h3v12"/>'),
    progress: svg('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>'),
    profile: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    bell: svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
    back: svg('<path d="m15 18-6-6 6-6"/>', 18),
    arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', 16),
    plus: svg('<path d="M12 5v14"/><path d="M5 12h14"/>', 18),
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    chev: svg('<path d="m9 18 6-6-6-6"/>', 18),
    steps: svg('<path d="M4 16v-2.4C4 11.5 3 10.5 3 8c0-2.7 1.5-6 4.5-6C9.4 2 10 3.8 10 5.5c0 3.1-2 5.7-2 8.7V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.4c0-2.1 1-3.1 1-5.6 0-2.7-1.5-6-4.5-6C14.6 6 14 7.8 14 9.5c0 3.1 2 5.7 2 8.7V20a2 2 0 1 0 4 0Z"/>'),
    scan: svg('<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>', 18)
  };
  var TABS = [['home', 'Home'], ['workout', 'Workout'], ['diet', 'Diet'], ['progress', 'Progress'], ['profile', 'Profile']];

  // ---------- State ----------
  var KEY = 'bodyiq-state-v1';
  var DEFAULT = {
    ob: true, step: 0,
    p: { name: '', gender: 'male', age: 24, height: 175, weight: 74, goal: 'muscle', level: 'beginner', place: 'gym', days: 4, diet: 'veg' },
    tab: 'home', mode: 'gym', water: 5, routine: 0,
    sets: [
      { prev: '70 × 10', kg: '72.5', reps: '10', done: true },
      { prev: '72.5 × 8', kg: '75', reps: '8', done: true },
      { prev: '75 × 6', kg: '77.5', reps: '6', done: false }
    ]
  };
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { S = null; }
  if (!S || !S.p) S = JSON.parse(JSON.stringify(DEFAULT));
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } }

  // ---------- Helpers ----------
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return Math.round(n).toLocaleString('en-IN'); }
  function title(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].title; return ''; }
  function firstName() { var n = (S.p.name || '').trim(); return n ? n.split(/\s+/)[0] : 'there'; }
  function initials() { var n = (S.p.name || '').trim(); return n ? n.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('') : 'ME'; }

  function calc() {
    var p = S.p;
    var bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.gender === 'female' ? -161 : 5);
    var act = p.days <= 3 ? 1.375 : p.days >= 6 ? 1.725 : 1.55;
    var adj = { lose: -450, muscle: 250, fit: 0, gain: 400 }[p.goal];
    var target = Math.round((bmr * act + adj) / 10) * 10;
    var bmi = p.weight / Math.pow(p.height / 100, 2);
    var protein = Math.round(p.weight * (p.goal === 'lose' ? 2 : 1.8));
    var fat = Math.round(target * 0.25 / 9);
    var carbs = Math.max(50, Math.round((target - protein * 4 - fat * 9) / 4));
    var plan = p.place === 'home' ? 'Home bodyweight program'
      : { 3: 'Full Body', 4: 'Upper / Lower split', 5: 'Push / Pull / Legs + Upper / Lower', 6: 'Push / Pull / Legs, twice a week' }[p.days];
    return {
      target: target, bmi: bmi, protein: protein, fat: fat, carbs: carbs, plan: plan,
      bmiCat: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obese range',
      stepGoal: p.level === 'beginner' ? 8000 : 10000
    };
  }

  function ring(value, max, color, track, big, small) {
    var c = 2 * Math.PI * 34, d = Math.min(1, value / max) * c;
    return '<div class="ring"><svg width="88" height="88" viewBox="0 0 84 84" aria-hidden="true">' +
      '<circle cx="42" cy="42" r="34" fill="none" stroke="' + track + '" stroke-width="9"/>' +
      '<circle cx="42" cy="42" r="34" fill="none" stroke="' + color + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + d.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 42 42)"/></svg>' +
      '<div class="lbl"><b>' + big + '</b><small>' + small + '</small></div></div>';
  }
  function bar(pct) { return '<div class="bar"><div style="width:' + Math.min(100, Math.round(pct)) + '%"></div></div>'; }

  // ---------- Onboarding ----------
  function option(field, o) {
    var on = S.p[field] === o.id;
    return '<button class="option' + (on ? ' on' : '') + '" data-act="set" data-f="' + field + '" data-v="' + o.id + '" aria-pressed="' + on + '">' +
      '<span><span class="t">' + o.title + '</span><span class="d">' + o.desc + '</span></span><span class="radio"></span></button>';
  }
  function pills(field, list) {
    return '<div class="pills">' + list.map(function (x) {
      var on = String(S.p[field]) === String(x[0]);
      return '<button class="pill' + (on ? ' on' : '') + '" data-act="set" data-f="' + field + '" data-v="' + x[0] + '" aria-pressed="' + on + '">' + x[1] + '</button>';
    }).join('') + '</div>';
  }
  function stepper(field, label, unit, hint) {
    return '<div class="card stepper"><div><div class="li-t">' + label + '</div><div class="li-d">' + hint + '</div></div>' +
      '<div class="ctrl"><button class="btn-beige" data-act="dec" data-f="' + field + '" aria-label="Decrease ' + label + '">−</button>' +
      '<div class="val"><b>' + S.p[field] + '</b> <span class="muted" style="font-size:12px">' + unit + '</span></div>' +
      '<button class="btn-dark" data-act="inc" data-f="' + field + '" aria-label="Increase ' + label + '">+</button></div></div>';
  }

  function renderOnboarding() {
    var step = STEPS[S.step];
    if (step === 'welcome') {
      return '<div class="ob-wrap"><div class="ob">' +
        '<div class="ob-welcome"><div class="monogram" style="width:128px;height:128px;font-size:34px">BIQ</div>' +
        '<div class="wordmark" style="font-size:34px;font-stretch:125%">BODY<span>IQ</span></div>' +
        '<div class="eyebrow muted" style="letter-spacing:2.4px">Smarter fitness. Better results.</div>' +
        '<p style="margin:18px 0 0;font-size:16px;line-height:1.5;color:#3D3832;max-width:300px">Workouts, diet, calories and steps in one place, built around your body.</p></div>' +
        '<button class="btn btn-dark btn-block" data-act="next" style="min-height:56px">Get started</button>' +
        '<div class="muted" style="text-align:center;font-size:13px">Takes about 1 minute</div></div></div>';
    }
    var c = calc(), body = '', head, sub;
    if (step === 'plan') { head = 'Your plan is ready, ' + esc(firstName()); sub = 'Built from your answers. You can edit it later.'; }
    else { head = TITLES[step][0]; sub = TITLES[step][1]; }

    if (step === 'name') {
      body = '<label class="field">Full name<input class="input" id="nameInput" type="text" autocomplete="name" placeholder="e.g. Aarav Kapoor" value="' + esc(S.p.name) + '"></label>' +
        '<div class="field">Gender' + pills('gender', [['male', 'Male'], ['female', 'Female'], ['other', 'Other']]) + '</div>';
    } else if (step === 'body') {
      body = stepper('age', 'Age', 'yrs', 'Between 14 and 80') + stepper('height', 'Height', 'cm', 'Between 130 and 220') + stepper('weight', 'Weight', 'kg', 'Between 35 and 200');
    } else if (step === 'goal') {
      body = GOALS.map(function (o) { return option('goal', o); }).join('');
    } else if (step === 'level') {
      body = LEVELS.map(function (o) { return option('level', o); }).join('');
    } else if (step === 'place') {
      body = PLACES.map(function (o) { return option('place', o); }).join('') +
        '<div class="field" style="margin-top:8px">Days per week' + pills('days', [[3, '3'], [4, '4'], [5, '5'], [6, '6']]) + '</div>';
    } else if (step === 'diet') {
      body = DIETS.map(function (o) { return option('diet', o); }).join('');
    } else if (step === 'plan') {
      var stats = [
        ['Daily calories', fmt(c.target), 'kcal · ' + title(GOALS, S.p.goal).toLowerCase()],
        ['BMI', c.bmi.toFixed(1), c.bmiCat],
        ['Protein', c.protein + ' g', 'per day'],
        ['Step goal', fmt(c.stepGoal), 'steps per day']
      ];
      body = '<div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">' + stats.map(function (s) {
        return '<div class="card" style="padding:14px"><div class="li-d" style="font-weight:600;margin:0">' + s[0] + '</div><div class="display" style="font-size:22px;margin:4px 0">' + s[1] + '</div><div style="font-size:12px;color:#5E5247">' + s[2] + '</div></div>';
      }).join('') + '</div>' +
        '<div class="card-dark stack" style="gap:6px;border-radius:22px"><span class="eyebrow">Your training plan</span><span class="display" style="font-size:20px">' + c.plan + '</span>' +
        '<span style="font-size:13px;color:#CFC6BA">' + S.p.days + ' days a week · ' + title(LEVELS, S.p.level) + ' · ' + title(PLACES, S.p.place) + '</span></div>';
    }
    var disabled = step === 'name' && !(S.p.name || '').trim();
    return '<div class="ob-wrap"><div class="ob">' +
      '<div class="ob-top"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button>' +
      '<div class="progress"><div style="width:' + Math.round(S.step / 7 * 100) + '%"></div></div>' +
      '<span class="muted" style="font-size:12px;font-weight:600;white-space:nowrap">' + (step === 'plan' ? 'All set' : S.step + ' of 6') + '</span></div>' +
      '<div><h1 class="display">' + head + '</h1><p class="sub">' + sub + '</p></div>' +
      '<div class="ob-body">' + body + '</div>' +
      '<button class="btn btn-dark btn-block" id="cta" data-act="next" style="min-height:56px"' + (disabled ? ' disabled' : '') + '>' + (step === 'plan' ? 'Start BodyIQ' : 'Continue') + '</button>' +
      '</div></div>';
  }

  // ---------- App sections ----------
  function pageHead(kicker, h, extra) {
    return '<div class="page-head"><div><div class="muted" style="font-size:13px;font-weight:500">' + kicker + '</div><h1 class="display">' + h + '</h1></div>' + (extra || '') + '</div>';
  }
  function todayLabel() { return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }); }

  function secHome(c) {
    var left = Math.max(0, c.target - EATEN.kcal);
    var cups = '';
    for (var i = 0; i < 8; i++) cups += '<button class="' + (i < S.water ? 'on' : '') + '" data-act="water" data-v="' + (i + 1) + '" aria-label="Set water to ' + (i + 1) + ' glasses"></button>';
    var weekState = ['done', 'done', 'miss', 'done', 'today', '', ''];
    var week = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(function (d, i) {
      return '<div class="d">' + d + '<div class="c ' + weekState[i] + '">' + (26 + i > 31 ? i - 5 : 26 + i) + '</div></div>';
    }).join('');
    var maxS = 12000;
    var chart = STEP_WEEK.map(function (d, i) {
      var cls = i === 6 ? 'now' : d[1] >= c.stepGoal ? 'hit' : '';
      return '<div class="col"><small>' + (d[1] / 1000).toFixed(1) + 'k</small><div class="' + cls + '" style="height:' + Math.round(d[1] / maxS * 160) + 'px"></div></div>';
    }).join('');
    return pageHead(todayLabel(), 'Hi ' + esc(firstName()) + ', ready to train?',
      '<button class="btn btn-dark desk-only" data-act="tab" data-v="workout">Start workout ' + I.arrow + '</button>') +
      '<div class="stack-lg">' +
      '<div class="grid grid-kpi">' +
      '<div class="card stack" style="gap:10px"><b style="font-size:13px">Calories</b>' + ring(EATEN.kcal, c.target, '#111111', '#EFE7DB', fmt(EATEN.kcal), 'kcal') + '<div class="kpi-sub">' + fmt(left) + ' left of ' + fmt(c.target) + '</div></div>' +
      '<div class="card-beige stack" style="gap:10px"><b style="font-size:13px">Steps</b>' + ring(STEPS_TODAY, c.stepGoal, '#7A6247', '#FFFFFF', fmt(STEPS_TODAY), 'steps') + '<div class="kpi-sub">Goal ' + fmt(c.stepGoal) + ' · 4.9 km</div></div>' +
      '<div class="card stack desk-only" style="gap:10px;flex-direction:column"><b style="font-size:13px">Workouts</b><div class="display" style="font-size:34px">4 <span style="font-size:14px">of ' + S.p.days + '</span></div>' + bar(4 / S.p.days * 100) + '<span class="muted" style="font-size:12px">This week</span></div>' +
      '<div class="card stack desk-only" style="gap:10px;flex-direction:column"><b style="font-size:13px">Weight</b><div class="display" style="font-size:34px">' + S.p.weight + ' <span style="font-size:14px">kg</span></div>' + bar(60) + '<span class="muted" style="font-size:12px">BMI ' + c.bmi.toFixed(1) + ' · ' + c.bmiCat + '</span></div>' +
      '</div>' +
      '<div class="grid grid-2">' +
      '<div class="card-dark stack" style="gap:14px"><div class="row"><span class="eyebrow">Today · Push day</span><span style="font-size:12px;color:#D9C9B2">' + c.plan + '</span></div>' +
      '<div><div class="display" style="font-size:26px">Chest &amp; Triceps</div><div style="font-size:13px;color:#CFC6BA;margin-top:4px">' + PLAN.length + ' exercises · 55 min · ' + title(PLACES, S.p.place) + '</div></div>' +
      '<div class="desk-only" style="flex-direction:column">' + PLAN.map(function (e) { return '<div class="plan-row"><span>' + e[0] + '</span><span>' + e[1] + '</span></div>'; }).join('') + '</div>' +
      '<button class="btn btn-beige btn-block" data-act="tab" data-v="workout">Start workout ' + I.arrow + '</button></div>' +
      '<div class="card stack desk-only" style="flex-direction:column"><div class="row"><div><h3>Steps this week</h3><div class="li-d">Goal ' + fmt(c.stepGoal) + ' a day</div></div><span class="chip">Health Connect</span></div>' +
      '<div class="steps-chart"><div class="goal" style="bottom:' + Math.round(c.stepGoal / maxS * 160) + 'px"></div>' + chart + '</div>' +
      '<div class="steps-days">' + STEP_WEEK.map(function (d) { return '<span>' + d[0] + '</span>'; }).join('') + '</div></div>' +
      '</div>' +
      '<div class="grid grid-2">' +
      '<div class="card stack"><div class="row"><div><h3>Water</h3><div class="li-d">' + S.water + ' of 8 glasses</div></div>' +
      '<button class="icon-btn" style="background:#111;color:#fff;border:none" data-act="water" data-v="' + Math.min(8, S.water + 1) + '" aria-label="Add a glass of water">' + I.plus + '</button></div><div class="cups">' + cups + '</div></div>' +
      '<div class="card stack"><div class="row"><h3>This week</h3><span class="muted" style="font-size:12px">4 of ' + S.p.days + ' workouts</span></div><div class="week">' + week + '</div></div>' +
      '</div></div>';
  }

  function secWorkout() {
    var head = pageHead('Week 3 of 8', 'Workout',
      '<div class="seg"><button class="' + (S.mode === 'gym' ? 'on' : '') + '" data-act="mode" data-v="gym">Gym</button><button class="' + (S.mode === 'home' ? 'on' : '') + '" data-act="mode" data-v="home">Home</button></div>');
    if (S.mode === 'home') {
      return head + '<p class="muted" style="margin:0 0 14px;font-size:14px">No equipment needed. Pick a program and follow along.</p><div class="grid grid-2">' +
        PROGRAMS.map(function (p) {
          return '<div class="program' + (p.dark ? ' dark' : '') + '"><div class="row" style="align-items:flex-start"><div><div class="eyebrow" style="opacity:.75">' + p.level + '</div>' +
            '<div class="display" style="font-size:20px;margin-top:4px">' + p.name + '</div></div><span class="time">' + p.time + '</span></div><div style="font-size:13px;opacity:.8">' + p.meta + '</div></div>';
        }).join('') + '</div>';
    }
    var volume = S.sets.filter(function (x) { return x.done; }).reduce(function (a, x) { return a + parseFloat(x.kg) * parseInt(x.reps, 10); }, 0);
    var rows = S.sets.map(function (x, i) {
      return '<div class="logger-grid set-row' + (x.done ? ' done' : '') + '"><b>' + (i + 1) + '</b><span class="prev">' + x.prev + '</span><b style="font-weight:600">' + x.kg + '</b><b style="font-weight:600">' + x.reps + '</b>' +
        '<button class="check' + (x.done ? ' on' : '') + '" data-act="toggleSet" data-v="' + i + '" aria-label="' + (x.done ? 'Mark set ' + (i + 1) + ' not done' : 'Mark set ' + (i + 1) + ' done') + '">' + I.check + '</button></div>';
    }).join('');
    var routines = ROUTINES.map(function (r, i) {
      return '<button class="routine' + (i === S.routine ? ' on' : '') + '" data-act="routine" data-v="' + i + '"><b>' + r.name + '</b><small>' + r.meta + '</small></button>';
    }).join('');
    var next = [['Incline Dumbbell Press', '3 sets · 22.5 kg · next up'], ['Tricep Rope Pushdown', '3 sets · 25 kg']].map(function (e) {
      return '<div class="card ex-head"><div class="ex-ico">' + I.workout + '</div><div class="grow"><div class="li-t">' + e[0] + '</div><div class="li-d">' + e[1] + '</div></div><span class="muted">' + I.chev + '</span></div>';
    }).join('');
    return head + '<div class="grid grid-2-1">' +
      '<div class="card stack desk-only" style="flex-direction:column;align-self:start"><h3>My routines</h3>' + routines + '<button class="btn-dashed">+ New routine</button></div>' +
      '<div class="stack">' +
      '<div class="card-dark row" style="border-radius:22px;padding:16px 18px"><div><div class="eyebrow">Live · ' + ROUTINES[S.routine].name + '</div><div class="display" style="font-size:26px;margin-top:4px">24:18</div></div>' +
      '<div style="text-align:right"><div style="font-size:12px;color:#CFC6BA">Volume</div><b style="font-size:17px">' + fmt(volume) + ' kg</b></div></div>' +
      '<div class="card stack" style="gap:10px"><div class="ex-head"><div class="ex-ico">' + I.workout + '</div><div class="grow"><div class="li-t">Bench Press</div><div class="li-d">Barbell · Chest</div></div><span class="chip">Rest 01:30</span></div>' +
      '<div class="logger"><div class="logger-grid logger-head"><span>SET</span><span>PREVIOUS</span><span>KG</span><span>REPS</span><span></span></div>' + rows + '</div>' +
      '<button class="btn-dashed" data-act="addSet">+ Add set</button></div>' + next +
      '<button class="btn btn-dark btn-block" data-act="finish">Finish workout</button></div></div>';
  }

  function secDiet(c) {
    var left = Math.max(0, c.target - EATEN.kcal);
    var macros = [['Protein', EATEN.protein, c.protein], ['Carbs', EATEN.carbs, c.carbs], ['Fat', EATEN.fat, c.fat]].map(function (m) {
      return '<div class="stack" style="gap:5px"><div class="row" style="font-size:12px"><b>' + m[0] + '</b><span style="color:#CFC6BA">' + m[1] + ' / ' + m[2] + ' g</span></div>' + bar(m[1] / m[2] * 100) + '</div>';
    }).join('');
    var meals = MEALS.map(function (m) {
      return '<div class="list-item"><div class="tile">' + m.short + '</div><div class="grow"><div class="li-t">' + m.name + '</div><div class="li-d">' + m.items + '</div></div>' +
        '<b style="font-size:13px;white-space:nowrap;' + (m.kcal ? '' : 'color:#7A6247') + '">' + (m.kcal ? m.kcal + ' kcal' : '+ Add') + '</b></div>';
    }).join('');
    return pageHead(title(DIETS, S.p.diet) + ' plan', 'Diet') + '<div class="grid grid-2-1">' +
      '<div class="card-dark stack-lg" style="align-self:start"><div class="grid" style="grid-template-columns:repeat(3,minmax(0,1fr));text-align:center">' +
      '<div><b style="font-size:20px">' + fmt(EATEN.kcal) + '</b><div style="font-size:12px;color:#CFC6BA">Eaten</div></div>' +
      '<div><b style="font-size:20px;color:#E8DCC9">' + fmt(left) + '</b><div style="font-size:12px;color:#CFC6BA">Left</div></div>' +
      '<div><b style="font-size:20px">310</b><div style="font-size:12px;color:#CFC6BA">Burned</div></div></div>' + macros + '</div>' +
      '<div class="stack"><div class="card"><div class="row" style="margin-bottom:6px"><h3>Today\'s meals</h3><span style="font-size:13px;color:#7A6247;font-weight:700">Target ' + fmt(c.target) + ' kcal</span></div>' + meals + '</div>' +
      '<button class="btn btn-dark btn-block">' + I.scan + ' Scan or search food</button></div></div>';
  }

  function secProgress(c) {
    var stats = [['18', 'Workouts'], ['8.2k', 'Avg steps'], ['12', 'Day streak']].map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');
    var prs = PRS.map(function (p) { return '<div class="pr"><div><div class="li-t">' + p[0] + '</div><div class="li-d">' + p[1] + '</div></div><b>' + p[2] + '</b></div>'; }).join('');
    return pageHead('Last 6 weeks', 'Progress') + '<div class="grid grid-2">' +
      '<div class="card stack"><div class="row" style="align-items:flex-end"><div><div class="muted" style="font-size:13px">Body weight</div><div class="display" style="font-size:30px">' + S.p.weight + ' <span style="font-size:15px">kg</span></div></div><span class="chip">BMI ' + c.bmi.toFixed(1) + '</span></div>' +
      '<svg width="100%" height="140" viewBox="0 0 310 120" preserveAspectRatio="none" role="img" aria-label="Weight trend over six weeks"><line x1="0" y1="30" x2="310" y2="30" stroke="#F0EAE0"/><line x1="0" y1="70" x2="310" y2="70" stroke="#F0EAE0"/><line x1="0" y1="110" x2="310" y2="110" stroke="#F0EAE0"/>' +
      '<polyline points="5,22 55,34 105,40 155,58 205,66 255,84 305,96" fill="none" stroke="#111" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="305" cy="96" r="5" fill="#111"/></svg>' +
      '<div class="row muted" style="font-size:11px"><span>6 weeks ago</span><span>3 weeks ago</span><span>Today</span></div></div>' +
      '<div class="stack"><div class="grid grid-3">' + stats + '</div><h3 style="margin:6px 0 0">Personal records</h3>' + prs + '</div></div>';
  }

  function secProfile(c) {
    var rows = [
      ['Goal', title(GOALS, S.p.goal)], ['Level', title(LEVELS, S.p.level)], ['Age', S.p.age + ' yrs'],
      ['Height', S.p.height + ' cm'], ['Weight', S.p.weight + ' kg'], ['Calorie target', fmt(c.target) + ' kcal'],
      ['Step goal', fmt(c.stepGoal)], ['Training', S.p.days + ' days · ' + title(PLACES, S.p.place)], ['Diet', title(DIETS, S.p.diet)]
    ].map(function (r) { return '<div class="profile-row"><span>' + r[0] + '</span><b style="font-weight:600">' + r[1] + '</b></div>'; }).join('');
    return '<div class="stack-lg" style="max-width:560px;margin:0 auto;padding-top:12px">' +
      '<div class="stack" style="align-items:center;text-align:center;gap:8px"><div class="avatar">' + initials() + '</div>' +
      '<div class="display" style="font-size:22px">' + esc((S.p.name || '').trim() || 'Your name') + '</div><div class="muted" style="font-size:13px">' + title(LEVELS, S.p.level) + ' · ' + title(PLACES, S.p.place) + '</div></div>' +
      '<div class="card" style="padding:0;overflow:hidden">' + rows + '</div>' +
      '<button class="btn btn-outline btn-block" data-act="edit">Edit body data</button>' +
      '<button class="btn btn-block" style="background:transparent;color:#6B6359" data-act="reset">Reset app (start fresh)</button></div>';
  }

  // ---------- Public website (laptop) ----------
  function brand(dark) {
    return '<span class="brand"><span class="monogram" style="width:40px;height:40px;font-size:13px' + (dark ? ';background:#EFE7DB;color:#111' : '') + '">BIQ</span>' +
      '<span class="wordmark" style="font-size:20px">BODY<span>IQ</span></span></span>';
  }
  function siteFooter() {
    return '<footer class="site-footer"><div class="wrap footer-grid">' +
      '<div class="stack" style="gap:14px">' + brand(true) + '<p style="margin:0;max-width:280px;line-height:1.6">Smarter fitness. Better results. Workouts, diet, calories and steps in one app.</p></div>' +
      '<div class="stack" style="gap:10px"><b>Product</b><a href="#features">Features</a><a href="#programs">Programs</a><a href="#pricing">Pricing</a></div>' +
      '<div class="stack" style="gap:10px"><b>Company</b><a href="#how">How it works</a><a href="mailto:hello@bodyiq.app">Contact</a></div>' +
      '<div class="stack" style="gap:10px"><b>Get the app</b><span>Android and iOS, coming soon</span></div>' +
      '</div><div class="wrap footer-bottom"><span>© ' + new Date().getFullYear() + ' BodyIQ. All rights reserved.</span><span>Privacy · Terms</span></div></footer>';
  }
  function renderLanding() {
    var ready = !S.ob;
    var cta = ready ? '<button class="btn btn-dark" data-act="dash">Open dashboard</button>' : '<button class="btn btn-dark" data-act="start">Get started free</button>';
    var features = [
      ['profile', 'Smart onboarding', 'Answer a few questions and get your calories, BMI, protein and training split.'],
      ['workout', 'Gym workout logger', 'Log weight and reps set by set, see last session and hit new personal records.'],
      ['home', 'Home workouts', 'Guided bodyweight programs from 12 to 25 minutes. No equipment needed.'],
      ['diet', 'Diet plans', 'Meal plans built on Indian food, for veg, eggetarian, non-veg or vegan.'],
      ['scan', 'Calorie tracking', 'Search or scan food and track calories, protein, carbs and fat against your target.'],
      ['steps', 'Step tracking', 'Syncs with Health Connect and Apple Health, with daily goals and streaks.'],
      ['progress', 'Progress tracking', 'Weight trend, body measurements, progress photos and strength charts.']
    ].map(function (f) {
      return '<div class="feature"><div class="feature-ico">' + I[f[0]] + '</div><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>';
    }).join('') + '<div class="feature feature-dark"><h3 class="display" style="font-size:24px">All in one app</h3><p>No more five different apps for workouts, food and steps.</p>' +
      (ready ? '<button class="btn btn-beige" data-act="dash">Open dashboard</button>' : '<button class="btn btn-beige" data-act="start">Start now</button>') + '</div>';
    var steps = [
      ['01', 'Tell us about you', 'Age, height, weight, goal, experience level, where you train and what you eat.'],
      ['02', 'Get your plan', 'BodyIQ works out your daily calories, macros, step goal and a training split.'],
      ['03', 'Train, eat, track', 'Log workouts and meals, sync steps, and watch your progress every week.']
    ].map(function (s) {
      return '<div class="how-step"><span class="how-num">' + s[0] + '</span><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div>';
    }).join('');
    var programs = PROGRAMS.map(function (p) {
      return '<div class="program' + (p.dark ? ' dark' : '') + '" style="min-height:190px;justify-content:space-between"><div class="row" style="align-items:flex-start"><div><div class="eyebrow" style="opacity:.75">' + p.level + '</div>' +
        '<div class="display" style="font-size:22px;margin-top:6px">' + p.name + '</div></div><span class="time">' + p.time + '</span></div><div style="font-size:14px;opacity:.8">' + p.meta + '</div></div>';
    }).join('');
    var gymSplits = ['Full Body', 'Upper / Lower', 'Push / Pull / Legs'].map(function (x) { return '<span class="split">' + x + '</span>'; }).join('');
    function plan(name, price, note, items, dark, btn) {
      return '<div class="price' + (dark ? ' price-dark' : '') + '"><div class="eyebrow">' + name + '</div><div class="display" style="font-size:40px">' + price + '</div><p style="margin:0">' + note + '</p>' +
        '<ul>' + items.map(function (i) { return '<li>' + I.check + i + '</li>'; }).join('') + '</ul>' + btn + '</div>';
    }
    var mock = '<div class="phone"><div class="phone-screen">' +
      '<div class="row" style="margin-bottom:10px"><span class="wordmark" style="font-size:13px">BODY<span>IQ</span></span><span class="monogram" style="width:24px;height:24px;font-size:8px">BIQ</span></div>' +
      '<div style="font-size:10px;color:#6B6359">Tuesday</div><div class="display" style="font-size:17px;margin:2px 0 10px">Hi Aarav, ready to train?</div>' +
      '<div class="card-dark" style="padding:12px;border-radius:16px"><div class="eyebrow" style="font-size:8px">Today · Push day</div><div class="display" style="font-size:15px;margin:4px 0">Chest &amp; Triceps</div>' +
      '<div style="background:#EFE7DB;color:#111;border-radius:12px;text-align:center;font-weight:700;font-size:11px;padding:8px;margin-top:8px">Start workout</div></div>' +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><div class="card" style="padding:8px;border-radius:14px">' + ring(1420, 2200, '#111', '#EFE7DB', '1,420', 'kcal') + '</div>' +
      '<div class="card-beige" style="padding:8px;border-radius:14px">' + ring(6840, 10000, '#7A6247', '#fff', '6,840', 'steps') + '</div></div>' +
      '<div class="card" style="padding:10px;border-radius:14px;margin-top:8px"><div style="font-size:10px;font-weight:600;margin-bottom:6px">Water · 5 of 8</div><div class="cups" style="gap:4px">' +
      '<button class="on" style="height:18px" tabindex="-1" aria-hidden="true"></button><button class="on" style="height:18px" tabindex="-1" aria-hidden="true"></button><button class="on" style="height:18px" tabindex="-1" aria-hidden="true"></button><button class="on" style="height:18px" tabindex="-1" aria-hidden="true"></button><button class="on" style="height:18px" tabindex="-1" aria-hidden="true"></button><button style="height:18px" tabindex="-1" aria-hidden="true"></button><button style="height:18px" tabindex="-1" aria-hidden="true"></button><button style="height:18px" tabindex="-1" aria-hidden="true"></button>' +
      '</div></div>' +
      '<div class="card" style="padding:10px;border-radius:14px;margin-top:8px;display:flex;align-items:center;gap:8px"><div class="tile" style="width:30px;height:30px;border-radius:9px">' + I.workout + '</div><div><div style="font-size:10px;font-weight:700">Next: Bench Press</div><div style="font-size:9px;color:#6B6359">3 sets · 77.5 kg</div></div></div>' +
      '<div class="card-beige" style="padding:10px;border-radius:14px;margin-top:8px"><div style="font-size:10px;font-weight:700;margin-bottom:6px">Protein 92 / 140 g</div><div class="bar"><div style="width:66%"></div></div></div>' +
      '</div></div>';

    return '<div class="site">' +
      '<header class="site-nav"><div class="wrap nav-row"><a href="#top" class="brand-link" aria-label="BodyIQ home">' + brand() + '</a>' +
      '<nav class="site-links" aria-label="Website"><a href="#features">Features</a><a href="#how">How it works</a><a href="#programs">Programs</a><a href="#pricing">Pricing</a></nav>' + cta + '</div></header>' +

      '<section class="hero" id="top"><div class="wrap hero-grid"><div class="hero-copy">' +
      '<span class="tag">Workouts · Diet · Calories · Steps</span>' +
      '<h1 class="display hero-h">Train smarter.<br>See better results.</h1>' +
      '<p class="lead">BodyIQ builds a plan around your body, then tracks every set, meal and step in one place. Home or gym, beginner or advanced.</p>' +
      '<div class="hero-ctas">' + cta.replace('btn btn-dark', 'btn btn-dark btn-lg') + '<a class="btn btn-outline btn-lg" href="#features">See features</a></div>' +
      '<ul class="hero-points"><li>' + I.check + 'Personal plan in 1 minute</li><li>' + I.check + 'Gym and home workouts</li><li>' + I.check + 'Made for Indian diets</li></ul></div>' +
      '<div class="hero-visual"><div class="hero-blob"></div>' + mock +
      '<div class="float-card float-a"><span class="eyebrow" style="color:#7A6247">New PR</span><b>Bench Press 77.5 kg</b></div>' +
      '<div class="float-card float-b dark"><span class="eyebrow" style="color:#D9C9B2">Today</span><b>780 kcal left</b></div></div></div></section>' +

      '<section class="strip"><div class="wrap strip-row"><span>Home workouts</span><span>Gym logger</span><span>Diet plans</span><span>Calorie tracking</span><span>Step tracking</span><span>Progress</span></div></section>' +

      '<section class="section" id="features"><div class="wrap"><div class="section-head"><span class="tag">Features</span><h2 class="display">Everything your fitness needs</h2><p class="lead">Seven tools that usually live in separate apps, working together.</p></div>' +
      '<div class="feature-grid">' + features + '</div></div></section>' +

      '<section class="section section-beige" id="how"><div class="wrap"><div class="section-head"><span class="tag">How it works</span><h2 class="display">From sign-up to your first workout in minutes</h2></div>' +
      '<div class="how-grid">' + steps + '</div></div></section>' +

      '<section class="section" id="programs"><div class="wrap"><div class="section-head row-head"><div><span class="tag">Programs</span><h2 class="display">Train anywhere</h2><p class="lead">Guided home programs, plus gym splits matched to how many days you can train.</p></div><div class="splits">' + gymSplits + '</div></div>' +
      '<div class="program-grid">' + programs + '</div></div></section>' +

      '<section class="section section-beige" id="pricing"><div class="wrap"><div class="section-head"><span class="tag">Pricing</span><h2 class="display">Start free</h2></div><div class="price-grid">' +
      plan('Free', '₹0', 'Everything you need to start.', ['Personal plan and calorie target', 'Gym logger and home workouts', 'Calorie and step tracking', 'Weight and progress charts'], false, ready ? '<button class="btn btn-dark btn-block" data-act="dash">Open dashboard</button>' : '<button class="btn btn-dark btn-block" data-act="start">Get started free</button>') +
      plan('Premium', 'Coming soon', 'For people who want more guidance.', ['Full weekly meal plans', 'Advanced strength analytics', 'Progress photo compare', 'Priority support'], true, '<button class="btn btn-beige btn-block" disabled>Notify me</button>') +
      '</div></div></section>' +

      '<section class="cta-band"><div class="wrap cta-row"><div><h2 class="display">Ready to train smarter?</h2><p>Set up your plan in about a minute.</p></div>' +
      (ready ? '<button class="btn btn-beige btn-lg" data-act="dash">Open dashboard</button>' : '<button class="btn btn-beige btn-lg" data-act="start">Get started free</button>') + '</div></section>' +
      siteFooter() + '</div>';
  }

  function renderApp() {
    var c = calc();
    var sec = { home: secHome, workout: secWorkout, diet: secDiet, progress: secProgress, profile: secProfile }[S.tab](c);
    var side = '<header class="topnav"><div class="wrap nav-row"><button class="brand-btn" data-act="landing" aria-label="BodyIQ website">' + brand() + '</button>' +
      '<nav class="top-links" aria-label="Main">' + TABS.slice(0, 4).map(function (t) {
        return '<button class="' + (S.tab === t[0] ? 'on' : '') + '" data-act="tab" data-v="' + t[0] + '"' + (S.tab === t[0] ? ' aria-current="page"' : '') + '>' + t[1] + '</button>';
      }).join('') + '</nav>' +
      '<button class="avatar-sm' + (S.tab === 'profile' ? ' on' : '') + '" data-act="tab" data-v="profile" aria-label="Profile">' + initials() + '</button></div></header>';
    var mhead = '<header class="mobile-head"><div style="display:flex;align-items:center;gap:10px"><div class="monogram" style="width:38px;height:38px;font-size:13px">BIQ</div>' +
      '<div class="wordmark" style="font-size:19px">BODY<span>IQ</span></div></div><button class="icon-btn" aria-label="Notifications">' + I.bell + '</button></header>';
    var bnav = '<nav class="bottomnav" aria-label="Main">' + TABS.map(function (t) {
      return '<button class="' + (S.tab === t[0] ? 'on' : '') + '" data-act="tab" data-v="' + t[0] + '"' + (S.tab === t[0] ? ' aria-current="page"' : '') + '><span class="pillicon">' + I[t[0]] + '</span>' + t[1] + '</button>';
    }).join('') + '</nav>';
    var foot = '<footer class="app-footer"><div class="wrap nav-row"><span>© ' + new Date().getFullYear() + ' BodyIQ · Smarter fitness. Better results.</span>' +
      '<button class="link-btn" data-act="landing">Visit website</button></div></footer>';
    return '<div class="shell">' + side + '<main class="content"><div class="wrap">' + mhead + sec + '</div></main>' + foot + bnav + '</div>';
  }

  // ---------- Render + events ----------
  var root = document.getElementById('app');
  var mq = window.matchMedia ? window.matchMedia('(min-width: 900px)') : { matches: false };
  function showLanding() { return mq.matches && ((S.ob && S.step === 0) || S.landing); }
  function render() {
    root.innerHTML = showLanding() ? renderLanding() : S.ob ? renderOnboarding() : renderApp();
    var inp = document.getElementById('nameInput');
    if (inp) {
      inp.addEventListener('input', function () {
        S.p.name = inp.value; save();
        document.getElementById('cta').disabled = !inp.value.trim();
      });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && inp.value.trim()) act('next'); });
    }
    save();
  }
  var LIMITS = { age: [14, 80], height: [130, 220], weight: [35, 200] };

  function act(a, el) {
    var v = el && el.getAttribute('data-v'), f = el && el.getAttribute('data-f');
    switch (a) {
      case 'next':
        if (STEPS[S.step] === 'name' && !(S.p.name || '').trim()) return;
        if (S.step >= 7) { S.ob = false; S.tab = 'home'; S.mode = S.p.place === 'home' ? 'home' : 'gym'; }
        else S.step++;
        window.scrollTo(0, 0); break;
      case 'back': S.step = Math.max(0, S.step - 1); break;
      case 'start': S.landing = false; S.ob = true; S.step = 1; window.scrollTo(0, 0); break;
      case 'dash': S.landing = false; window.scrollTo(0, 0); break;
      case 'landing': S.landing = true; window.scrollTo(0, 0); break;
      case 'set': S.p[f] = f === 'days' ? parseInt(v, 10) : v; break;
      case 'inc': S.p[f] = Math.min(LIMITS[f][1], S.p[f] + 1); break;
      case 'dec': S.p[f] = Math.max(LIMITS[f][0], S.p[f] - 1); break;
      case 'tab': S.tab = v; window.scrollTo(0, 0); break;
      case 'mode': S.mode = v; break;
      case 'water': S.water = parseInt(v, 10); break;
      case 'routine': S.routine = parseInt(v, 10); break;
      case 'toggleSet': S.sets[+v].done = !S.sets[+v].done; break;
      case 'addSet': S.sets.push({ prev: '—', kg: '77.5', reps: '6', done: false }); break;
      case 'finish': S.sets.forEach(function (x) { x.done = true; }); S.tab = 'progress'; break;
      case 'edit': S.ob = true; S.step = 1; break;
      case 'reset': if (window.confirm('Reset BodyIQ and start onboarding again?')) { S = JSON.parse(JSON.stringify(DEFAULT)); } break;
      default: return;
    }
    render();
  }
  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (el && !el.disabled) act(el.getAttribute('data-act'), el);
  });

  if (mq.addEventListener) mq.addEventListener('change', render);
  else if (mq.addListener) mq.addListener(render);

  render();
})();
