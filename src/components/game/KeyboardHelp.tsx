import React from 'react';

function KeyboardHelp() {
  return (
    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg text-sm w-full max-w-md">
      <h3 className="font-bold mb-2">Keyboard Controls:</h3>
      <ul className="space-y-1">
        <li>
          <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd>
          {' '} Roll dice / Measure weight
        </li>
        <li>
          <kbd className="px-2 py-1 bg-white/10 rounded">↑</kbd>
          {' '} or {' '}
          <kbd className="px-2 py-1 bg-white/10 rounded">↓</kbd>
          {' '} Tare scale
        </li>
      </ul>
    </div>
  );
}

export default KeyboardHelp;