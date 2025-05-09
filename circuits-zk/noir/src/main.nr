fn main(birth_year: Field, current_year: pub Field) {
    let age: u16 = (current_year - birth_year) as u16;
    // Check that age is between 18 and 100
    assert(age >= 18);
    assert(age <= 100);
}

#[test]
fn test_main() {
    main(1997, 2025);
}

#[test(should_fail)]
fn test_fail_main() {
    main(2020, 2025);
}
