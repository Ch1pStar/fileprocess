package fileprocess;

import java.io.*;

public class Main {


  /**
   * Entry point of the application,
   * takes user input from the standart input(System.in)
   * and calls the appropriate FileProcessor methods
   */
  public static void main(String[] args) {
    BufferedReader stdin = new BufferedReader(
              new InputStreamReader(System.in));
    String input = null;
    String filePath = null;
    boolean lineSwapOptionSet = false, 
        numberSwapOptionSet = false, 
        crudOptionSet = false;
    FileProcessor fpc = null;
    
    System.out.println("File path: ");
    try {
      while ((input = stdin.readLine()) != null){
        if(filePath == null){
          filePath = input;
          fpc = new FileProcessor(filePath);
        }else if(lineSwapOptionSet){
          String[] indices = input.trim().split("\\s+");
          try{
            fpc.swapLines(Integer.parseInt(indices[0]),
                    Integer.parseInt(indices[1]));  
          }catch(Exception e){
            System.out.println("Invalid index arguments");
          }
          lineSwapOptionSet = false;
        }else if(numberSwapOptionSet){
          String[] indices = input.trim().split("\\s+");
          try{
            fpc.swapNumbers(Integer.parseInt(indices[0]), 
                      Integer.parseInt(indices[1]), 
                      Integer.parseInt(indices[2]), 
                      Integer.parseInt(indices[3]));  
          }catch(Exception e){
            System.out.println("Invalid index arguments");
          }
          numberSwapOptionSet = false;
        }else if(crudOptionSet){
          String[] inputArr = input.trim().split("\\s+");
          try{
            int[] indices = new int[inputArr.length -1];
            for (int i = 0; i < indices.length; i++) {
              indices[i] = Integer.parseInt(inputArr[i+1]);
            }
            fpc.applyCRUDAction(inputArr[0], indices);
          }catch(Exception e){
            System.out.println("Invalid index arguments");
          }
          crudOptionSet = false;
        }else if(input.equals("a")){
          try {
      fpc.validate();
          } catch (Exception e) {
      e.printStackTrace();
          }
        }else if(input.equals("b")){
            lineSwapOptionSet = true;
            System.out.println("Enter line indices:");
          }else if(input.equals("c")){
            numberSwapOptionSet = true;
            System.out.println("Enter line and number indices:");
          }else if(input.equals("d")){
            try {
        fpc.save();
      } catch (Exception e) {
        e.printStackTrace();
      }
          }else if(input.equals("e")){
            crudOptionSet = true;
            System.out.println("Enter operation(\"create\", \"read\", "+
            "\"update\" or \"delete\") followed by the appropriate parameters");
          }else if(input.equals("exit")){
          System.exit(0);
        }else{
          System.out.println("Unknown action \""+input+"\", please try again ");
        }
        if(!lineSwapOptionSet && !numberSwapOptionSet && !crudOptionSet){
          System.out.println("Choose action:\n\t"+
            "\"a\" - Validate the file contents\n\t"+
            "\"b\" - Switch entire line from the file "+
                  "with an entire other line\n\t"+
            "\"c\" - Switch number at specific index in one "+
              "line with a number with specific index from another line\n\t"+
            "\"d\" - Validate and save the result\n\t"+
            "\"e\" - Apply \"CRUD\" operations on a selected "+
                        "position of a number\n\t"+
            "\"exit\" - Exit the application\n\t"
          );
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
