pragma circom 2.0.0;

include "../../circomlib/circuits/comparators.circom";

template LocationV2() {

  signal input latitude;
  signal input longitude;

  signal output is_outside;

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

  // Check if inside
  signal step1;
  signal step2;
  signal is_inside;

  step1 <== less_than_top_latitude * more_than_bottom_latitude;
  step2 <== less_than_right_longitude * more_than_left_longitude;
  is_inside <== step1 * step2;

  // Final output: true if OUTSIDE
  is_outside <== 1 - is_inside;


}

component main = LocationV2();