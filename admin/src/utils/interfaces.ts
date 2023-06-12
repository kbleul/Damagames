export type Answer={
   name:string;
   answer:boolean
}


export interface AddQuestionForm {
  question: string;
  choices: Answer[];
}


export interface AddVideoForm {
  category: string;
  video: object ;
  description:string;
  title:string;
  thumbnail: object;
}
