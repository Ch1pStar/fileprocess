package fileprocess;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;

public class FileProcessor {
  
  private String filePath = null;
    private ArrayList<ArrayList<String>> lines = null;
    private File file = null;
    
  public FileProcessor(String path) {
    this.filePath = path;
    this.file = new File(this.filePath);
    this.lines = new ArrayList<ArrayList<String>>();
    FileInputStream fis = null;
    BufferedReader fileReader = null;
    String line = null;
    String[] numbers = null;
    try {
      fis = new FileInputStream(this.file);
      fileReader = new BufferedReader(new InputStreamReader(fis));
      
      while((line = fileReader.readLine()) != null){
        numbers = line.split("\\s+");
        ArrayList<String> numbersList = new ArrayList<String>();
        for (int i = 0; i < numbers.length; i++) {
          numbersList.add(numbers[i]);
        }
        this.lines.add(numbersList);
      }
 
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      try {
        if (fis != null)
          fis.close();
      } catch (IOException ex) {
        ex.printStackTrace();
      }
    }
    
  }
  
  public void swapLines(int index1, int index2){
    Collections.swap(this.lines, index1, index2);
  }
  
  public void swapNumbers(int lineIndex1, int numberIndex1,int lineIndex2,
                              int numberIndex2){
    String t = this.lines.get(lineIndex1).get(numberIndex1);
    this.lines.get(lineIndex1).set(numberIndex1, 
        this.lines.get(lineIndex2).get(numberIndex2));
    
    this.lines.get(lineIndex2).set(numberIndex2, t);
  }
  
  public void save() throws Exception{
    this.validate();
    PrintWriter writer = new PrintWriter(this.filePath);
    int lineIndex = 0;
    for (ArrayList<String> line : this.lines) {
      String lineStr = "";
      for (int i = 0; i < line.size(); i++) {
        lineStr +=line.get(i);
        if(i<line.size()-1){
          lineStr +=" ";
        }
      }
      if(lineIndex++ < this.lines.size()-1){
        writer.println(lineStr);    
      }else{
        writer.print(lineStr);
      }
    }
    writer.close();
    
  }
  
  public void validate() throws Exception{
    int lineIndex = 0;
    for (ArrayList<String> line : this.lines) {
      for (int i = 0; i < line.size(); i++) {
        if(!line.get(i).matches("\\d+")){
          throw new Exception("line "+(lineIndex+1)+" number \""+
                  line.get(i)+"\"("+(i+1)+") is not allowed");
        }
        if(line.get(i).charAt(0)=='0'){
          throw new Exception("line "+(lineIndex+1)+" number \""+
                  line.get(i)+"\"("+(i+1)+") starts with 0");
        }
      }
      lineIndex++;
    }
  }

  public void applyCRUDAction(String action, int[] indices){
    if(action.equals("create")){
      this.lines.get(indices[0]).add(indices[1], 
              Integer.toString(indices[2]));
    
    }else if(action.equals("read")){
      System.out.println(this.lines.get(indices[0]).get(indices[1]));
    
    }else if(action.equals("update")){
      this.lines.get(indices[0]).set(indices[1], 
              Integer.toString(indices[2]));
    
    }else if(action.equals("delete")){
      this.lines.get(indices[0]).remove(indices[1]);
    }else{
      System.out.println("Unknown operation \""+action+
                    "\", please try again");
    }
  }
}
