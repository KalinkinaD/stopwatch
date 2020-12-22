import { useEffect, useState } from 'react';
import { timer, interval } from 'rxjs';
import { first, startWith, scan, share } from 'rxjs/operators';
import './App.css';

const App = () => {
  const [time, setTime] = useState(0);
  const [isGoing, setIsGoing] = useState(false);
  let timer$ = interval(1000);
  useEffect(() => {
    let start;

    start = timer$
      .pipe(
        startWith(time),
        scan(time => time + 1),
        share(),
      )
      .subscribe(i => {
        if (isGoing) {
          setTime(i);
        }
      });

    return () => start.unsubscribe();
  }, [isGoing, time, timer$]);

  const handleClick = button => {
    const start = isGoing;
    if (button === 'Start') {
      setIsGoing(!start);
    } else if (button === 'Stop') {
      setTime(0);
      setIsGoing(!start);
    }
  };
  const handleReset = () => {
    setIsGoing(true);
    setTime(0);
  };
  const handleWait = () => {
    const dbClick = timer(300);
    dbClick.pipe(first()).subscribe(() => {
      setIsGoing(false);
    });
  };

const toHHMMSS = time => {
  return new Date(time * 1000).toISOString().substr(11, 8);
}

  return (
    <div className="App">
      <div className="displayWrapper">
       {toHHMMSS(time)}
      </div>
      <div className="btnWrapper">
        <button
          onClick={
            isGoing ? () => handleClick('Stop') : () => handleClick('Start')
          }
        >
          {isGoing ? 'Stop' : 'Start'}
        </button>
        <button onDoubleClick={handleWait}>Wait</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default App;
