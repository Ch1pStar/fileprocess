#!/usr/bin/perl
use strict;
use warnings;

# while(my $line = <>){
# 	print $line;
# }

my $crazy = "dufuq is this shit, I am seriously you guys";

open FILE, "<", "in" or die $crazy;

while (my $line  = <FILE>) {
  print $line;
}