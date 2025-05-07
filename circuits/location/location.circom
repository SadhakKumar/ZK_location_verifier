pragma circom 2.0.0;

include "../../circomlib/circuits/comparators.circom";

template LocationInIndia() {
    // Private inputs
    signal input latitude;
    signal input longitude;

    // Output
    signal output inIndia;

    // Scale inputs (e.g., 28.6139 -> 286139)
    signal lat_scaled <== latitude;
    signal lon_scaled <== longitude;

    // lat_scaled <== latitude * 10000;
    // lon_scaled <== longitude * 10000;

    // Bounds for India (scaled ×10000)
    var LAT_MIN = 65000;
    var LAT_MAX = 376000;
    var LON_MIN = 687000;
    var LON_MAX = 972500;

    component lat_ge_min = GreaterEqThan(40);
    lat_ge_min.in[0] <== lat_scaled;
    lat_ge_min.in[1] <== LAT_MIN;

    component lat_le_max = LessThan(40);
    lat_le_max.in[0] <== lat_scaled;
    lat_le_max.in[1] <== LAT_MAX + 1;

    component lon_ge_min = GreaterEqThan(40);
    lon_ge_min.in[0] <== lon_scaled;
    lon_ge_min.in[1] <== LON_MIN;

    component lon_le_max = LessThan(40);
    lon_le_max.in[0] <== lon_scaled;
    lon_le_max.in[1] <== LON_MAX + 1;

    // Multiply in pairs to avoid non-quadratic constraint
    signal tmp1;
    signal tmp2;

    tmp1 <== lat_ge_min.out * lat_le_max.out;
    tmp2 <== lon_ge_min.out * lon_le_max.out;

    inIndia <== tmp1 * tmp2;
}

component main = LocationInIndia();
