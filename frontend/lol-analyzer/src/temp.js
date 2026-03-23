const target = 23;
const sorted = [4,7,14];


let res = 0;
let landingIdx = 0;

for (let i = 0; i < sorted.length; i++) {
    console.log(landingIdx, sorted[i]);
    if (landingIdx <= sorted[i]) {
        console.log("@@")
        res += (sorted[i] - landingIdx);
        landingIdx = sorted[i] + 10;
    }
    console.log('res', res);
}

if (target > landingIdx) res += (target - landingIdx);
console.log(res);