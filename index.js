const fs = require('fs');
const input = fs.readFileSync('./input.txt').toString();
let arrayinput = input.split('\r\n');

const part1 = () => {
  let map = calcMap(arrayinput, true);
  return findBestLocation(map);
};

const findBestLocation = map => {
  let numAsteroids = 0;
  let positionAsteroid = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== '.') {
        if (map[y][x] > numAsteroids) {
          numAsteroids = map[y][x];
          positionAsteroid = [x, y];
        }
      }
    }
  }

  return { asteroids: numAsteroids, pos: positionAsteroid };
};

//transform map with numbers of visible asteroids to each one
const calcMap = (map, isPart1) => {
  let newMap = map.map(str => str.split(''));

  for (let y = 0; y < newMap.length; y++) {
    for (let x = 0; x < newMap[y].length; x++) {
      if (newMap[y][x] !== '.') {
        if (isPart1) {
          let object = calcVisibleAsteroids(map, x, y);
          newMap[y][x] = object.total;
        } else {
          newMap[y][x] = '#';
        }
      }
    }
  }

  return newMap;
};

const calcVisibleAsteroids = (primitiveMap, posX, posY) => {
  let map = [...primitiveMap];
  let total = 0;
  let listAsteroids = [];

  //loop map, if asteroid and not himself do something
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== '.' && (x !== posX || y !== posY)) {
        let distX = Math.abs(posX - x);
        let distY = Math.abs(posY - y);

        //calculate the minimum distance to encounter an asteroid in the same line
        let distance = simplifyDistance(distX, distY);
        distX = distance.x;
        distY = distance.y;

        let auxX = posX;
        let auxY = posY;
        let blocked = false;
        //loop through positions in an imaginary line using the min distance calculated
        while (!blocked && (auxX !== x || auxY !== y)) {
          //x pos
          if (x >= auxX) {
            auxX += distX;
          } else {
            auxX -= distX;
          }

          //y pos
          if (y >= auxY) {
            auxY += distY;
          } else {
            auxY -= distY;
          }

          //if it's an asteroid and it's not the asteroid we are
          //comparing with, it's a blocking asteroid
          if (map[auxY][auxX] !== '.' && (auxY !== y || auxX !== x)) {
            blocked = true;
          }
        }

        //count visible asteroids
        if (!blocked) {
          total++;
          listAsteroids.push([x, y]);
        }
      }
    }
  }

  return { total: total, listAsteroids: listAsteroids };
};

const simplifyDistance = (distX, distY) => {
  let smallerDist = 0;

  //calc smaller Distance between X and Y
  if (distY === 0) {
    smallerDist = distX;
  } else if (distX === 0) {
    smallerDist = distY;
  } else {
    smallerDist = distX >= distY ? distY : distX;
  }

  //simplify de distances if possible
  let auxSmallerDist = smallerDist;
  while (distX % auxSmallerDist !== 0 || distY % auxSmallerDist !== 0) {
    auxSmallerDist--;
    if (auxSmallerDist === 0) {
      break;
    }
  }
  if (auxSmallerDist !== 0) {
    smallerDist = auxSmallerDist;
  }

  distX = distX / smallerDist;
  distY = distY / smallerDist;

  return { x: distX, y: distY };
};

console.time('part1');
console.log(part1());
console.timeEnd('part1');

const part2 = () => {
  result = calcBet(arrayinput, [26, 29]);
  return result;
};

const calcBet = (primitiveMap, laserPos) => {
  const map = [...primitiveMap];
  let [x, y] = laserPos;

  const object = calcVisibleAsteroids(map, x, y);
  let listAsteroids = object.listAsteroids;

  let listVaporizedAsteroidsSorted = listAsteroids.sort((a, b) => {
    return getAngle(a, x, y) - getAngle(b, x, y);
  });

  const asteroidTwoHundred = calcAsteroidVaporizedNumberX(
    listVaporizedAsteroidsSorted,
    200
  );

  return asteroidTwoHundred[0] * 100 + asteroidTwoHundred[1];
};

const getAngle = (coordinate, x, y) => {
  let x2 = coordinate[0];
  let y2 = coordinate[1];

  let radians = Math.atan2(y2 - y, x2 - x);
  let degrees = radians * (180 / Math.PI) + 90;

  if (degrees < 0) degrees = 360 + degrees;

  return degrees;
};

const calcAsteroidVaporizedNumberX = (listVaporizedAsteroids, num) => {
  return listVaporizedAsteroids[num - 1];
};

console.time('part2');
console.log(part2());
console.timeEnd('part2');

////////////////////////////////TESTS///////////////////////////////////////////

const test = '.7..7\n.....\n67775\n....7\n...87';
const test2 = '.#..#\n.....\n#####\n....#\n...##';
const test3 =
  '......#.#.\n#..#.#....\n..#######.\n.#.#.###..\n.#..#.....\n..#....#.#\n#..#....#.\n.##.#..###\n##...#..#.\n.#....####';
const test4 =
  '#.........\n...A......\n...B..a...\n.EDCG....a\n..F.c.b...\n.....c....\n..efd.c.gb\n.......c..\n....f...c.\n...e..d..c';
const test5 =
  '#.#...#.#.\n.###....#.\n.#....#...\n##.#.#.#.#\n....#.#.#.\n.##..###.#\n..#...##..\n..##....##\n......#...\n.####.###.';
const test6 =
  '.#..#..###\n####.###.#\n....###.#.\n..###.##.#\n##.##.#.#.\n....###..#\n..#.#..#.#\n#..#.#.###\n.##...##.#\n.....#.#..';
const test7 =
  '.#..##.###...#######\n##.############..##.\n.#.######.########.#\n.###.#######.####.#.\n#####.##.#.##.###.##\n..#####..#.#########\n####################\n#.####....###.#.#.##\n##.#################\n#####.##.###..####..\n..######..##.#######\n####.##.####...##..#\n.#####..#.######.###\n##...#.##########...\n#.##########.#######\n.####.#.###.###.#.##\n....##.##.###..#####\n.#.#.###########.###\n#.#.#.#####.####.###\n###.##.####.##.#..##';

//console.log(findBestLocation(test.split('\n')));
//console.log(calcMap(test2.split('\n')));
//console.log(findBestLocation(calcMap(test3.split('\n'))));
//console.log(calcVisibleAsteroids(test4.split('\n'), 0, 0));
//console.log(findBestLocation(calcMap(test7.split('\n'))));
//console.log(calcBet(test7.split('\n'), 11, 13));

//console.log(calcVisibleAsteroids(test7.split('\n'), 11, 13));
//console.log(second(test7.split('\n'), [11, 13]));
