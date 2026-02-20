use poseidon::poseidon::bn254::hash_2 as poseidon2;

fn main(random: Field, pk_b: Field) -> pub Field {
    poseidon2([random, pk_b])
}
