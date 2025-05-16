pragma circom 2.0.0;

include "../../circomlib/circuits/comparators.circom";

template LocationV2() {
    // Inputs
    signal input latitude;
    signal input longitude;

    // Output signal
    signal output is_inside;

    // Bounds for India
    var left_longitude = 68;
    var right_longitude = 97;
    var top_latitude = 37;
    var bottom_latitude = 6;

    // Comparison results
    component lt_top = LessThan(252);
    component gt_bottom = GreaterThan(252);
    component lt_right = LessThan(252);
    component gt_left = GreaterThan(252);

    // Wiring inputs
    lt_top.in[0] <== latitude;
    lt_top.in[1] <== top_latitude;

    gt_bottom.in[0] <== latitude;
    gt_bottom.in[1] <== bottom_latitude;

    lt_right.in[0] <== longitude;
    lt_right.in[1] <== right_longitude;

    gt_left.in[0] <== longitude;
    gt_left.in[1] <== left_longitude;

    // All conditions must be true (i.e., equal to 1)
    signal all_inside;
    all_inside <== lt_top.out * gt_bottom.out * lt_right.out * gt_left.out;

    // Output 1 if inside, 0 otherwise
    is_inside <== all_inside;
}

component main = LocationV2();