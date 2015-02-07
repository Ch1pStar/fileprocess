#!/usr/bin/perl
use strict;
use warnings;
use Data::Dump qw(dump);
use 5.014;

my $filePathSet = 0;
my $filePath;
my $lineSwapOptionSet = 0;
my $numberSwapOptionSet = 0;
my $crudOptionSet = 0;
my @data;

print "File path: ";
while(my $command = <>){
  chomp($command);
  if(!$filePathSet){
    @data = processFile($command);
    $filePath = $command;
    $filePathSet = 1;
  }elsif($lineSwapOptionSet){
    my @indices = split(' ', $command);
    if(scalar(@indices) < 2){
      die "Not enough arguments";
    }
    if($indices[0] >= (scalar(@data)) || $indices[1] >= (scalar(@data))){
      die "Index out of bounds";
    }else{
      @data[$indices[0],$indices[1]] = @data[$indices[1],$indices[0]];
    }
    $lineSwapOptionSet = 0;
  }elsif($numberSwapOptionSet){
    my @indices = split(' ', $command);
    if(scalar(@indices) < 4){
      die "Not enough arguments";
    }
    if($indices[0] >= (scalar(@data)) || $indices[2] >= (scalar(@data))){
      die "Index out of bounds";
    }else{
      my $a = $data[$indices[0]][$indices[1]];
      $data[$indices[0]][$indices[1]] = $data[$indices[2]][$indices[3]];
      $data[$indices[2]][$indices[3]] = $a;
    }

    $numberSwapOptionSet = 0;
  }elsif($crudOptionSet){
    my @indices = split(' ', $command);
    my $action = shift @indices;
    if($action eq "create"){
      splice $data[$indices[0]], $indices[1], 0, $indices[2];
    }elsif($action eq "read"){
      print $data[$indices[0]][$indices[1]]."\n";
    }elsif($action eq "update"){
      $data[$indices[0]][$indices[1]] = $indices[2];
    }elsif($action eq "delete"){
      splice $data[$indices[0]], $indices[1], 1;
    }else{
      warn  "Unknown action";
    }

    $crudOptionSet = 0;
  }elsif($command eq "a"){
    validateData(@data);
  }elsif($command eq "b"){
    $lineSwapOptionSet = 1;
    print "Enter line indices: ";
  }elsif($command eq "c"){
    $numberSwapOptionSet = 1;
    print "Enter line and number indices: ";
  }elsif($command eq "d"){
    saveToFile(\@data, $filePath);
  }elsif($command eq "e"){
    $crudOptionSet = 1;
    print "Enter operation(\"create\", \"read\", \"update\" or \"delete\")\n".
      "followed by the appropriate parameters: ";
  }elsif($command eq "exit"){
    exit 0;
  }else{
    print "Invalid operation\n";
  }

  if(!$lineSwapOptionSet && !$numberSwapOptionSet && !$crudOptionSet){
    print "Choose action:\n\t\"a\" - Validate the file contents\n\t".
      "\"b\" - Switch entire line from the file with an entire other line\n\t".
      "\"c\" - Switch number at specific index in one line with a number with ".
      "specific index from another line\n\t".
      "\"d\" - Validate and save the result\n\t".
      "\"e\" - Apply \"CRUD\" operations on a selected position of a number\n\t".
      "\"exit\" - Exit the application\n";
  }
}

sub processFile{
  my $filePath = $_[0];
  my @lineArray;
  my @data;
  open my $file, "+<", $filePath or die $!;
  while (my $line  = <$file>) {
    chomp($line);
    my @numbers = split(/\s+/mi, $line);
    push(@data, \@numbers);  
  }
  close $file;
  return @data;
}

sub validateData{
  my $lineCounter = 0;
  for(@_){
    my @line = $_;
    my $numberCounter = 0;
    for my $numbers(@line){
      for my $number(@$numbers){
        if($number =~ /\D+/i){
          die "line ".($lineCounter+1).", number ".($numberCounter+1).", character (@-), is not allowed\n";
        }
        if(substr($number, 0, 1) eq "0"){
          die "line ".($lineCounter+1).", number ".($numberCounter+1).", starts with 0\n";
        }
        $numberCounter++; 
      }
      $lineCounter++;
    }
  }
}

sub saveToFile{
  my $data = $_[0];
  validateData(@data);
  open my $file, '>', $_[1];
  my $lineCounter = 0;
  for my $line(@data){
    my $numberCounter = 0;
    for my $number(@$line){
      print $file $number;
      if(++$numberCounter < @$line){
        print $file ' ';
      }
    }
    if(++$lineCounter < @$data){
      print $file "\n";
    }
  }
  close $file;
  print "File $filePath saved!\n";
}