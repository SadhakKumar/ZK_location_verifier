pragma circom 2.0.0;

include "../../circomlib/circuits/comparators.circom";

template LocationV2() {

  signal input latitude;
  signal input longitude;

  signal more_than_left_longitude;
  signal less_than_right_longitude;
  signal more_than_bottom_latitude;
  signal less_than_top_latitude;

  var left_longitude = 68; 
  var right_longitude = 97; 
  var top_latitude = 37; 
  var bottom_latitude = 6; 

  less_than_top_latitude <== LessThan(252)([latitude, top_latitude]);
  more_than_bottom_latitude <== GreaterThan(252)([latitude, bottom_latitude]);
  less_than_right_longitude <== LessThan(252)([longitude, right_longitude]);
  more_than_left_longitude <== GreaterThan(252)([longitude, left_longitude]);

  less_than_top_latitude === 1;
  more_than_bottom_latitude === 1;
  less_than_right_longitude === 1;
  more_than_left_longitude === 1;

}

component main = LocationV2();