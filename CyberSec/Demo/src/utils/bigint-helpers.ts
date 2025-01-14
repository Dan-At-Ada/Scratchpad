export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === BigInt(1)) return BigInt(0);
  let result = BigInt(1);
  base = base % modulus;
  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    exponent = exponent / BigInt(2);
    base = (base * base) % modulus;
  }
  return result;
}

export function modInverse(a: bigint, m: bigint): bigint {
  a = BigInt(a);
  m = BigInt(m);
  let m0 = m;
  let y = BigInt(0);
  let x = BigInt(1);

  if (m === BigInt(1)) return BigInt(0);

  while (a > BigInt(1)) {
    let q = a / m;
    let t = m;

    m = a % m;
    a = t;
    t = y;

    y = x - q * y;
    x = t;
  }

  if (x < BigInt(0)) x += m0;

  return x;
}

export function gcd(a: bigint, b: bigint): bigint {
  a = BigInt(a);
  b = BigInt(b);
  if (b === BigInt(0)) return a;
  return gcd(b, a % b);
}

