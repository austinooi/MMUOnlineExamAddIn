import * as React from "react";
import axios from "axios";
import { MessageBar, MessageBarType } from "@fluentui/react";
import { submitQuestions } from "./Notification";

const createExam = (title, numberOfQ) => {
  // console.log(numberOfQ)

  return Word.run(async (context) => {
    context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);

    for (let j = numberOfQ + 1; j <= 10; j++) {
      // context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
      const range = context.document.getSelection();
      const questionContentControl = range.insertContentControl();
      questionContentControl.tag = "question" + j;
      questionContentControl.title = "Question " + j;
      questionContentControl.cannotEdit = true;
      questionContentControl.cannotDelete = true;
      questionContentControl.appearance = "Hidden";
      questionContentControl.placeholderText = " ";
      questionContentControl.font.size = 12;
      questionContentControl.font.name = "Times New Roman";

      // context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
    }

    context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);

    for (let i = 0; i < numberOfQ; i++) {
      context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
      const range = context.document.getSelection();
      const questionContentControl = range.insertContentControl();
      questionContentControl.tag = "question" + (numberOfQ - i);
      questionContentControl.title = "Question " + (numberOfQ - i);
      questionContentControl.cannotEdit = false;
      questionContentControl.cannotDelete = true;
      questionContentControl.placeholderText = "Enter Question Here";
      questionContentControl.appearance = "Tags";
      questionContentControl.font.size = 12;
      questionContentControl.font.name = "Times New Roman";
      context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
    }
    context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
    const examTitle = context.document.body.insertText(title, Word.InsertLocation.start);
    examTitle.font.color = "Black";
    examTitle.font.size = 16;
    examTitle.font.underline = "Single";
    examTitle.font.name = "Times New Roman";
    await context.sync();
  });
};

const uploadQuestions = (exam_title, numberofQ, lect_id, exam_id) => {
  // submitQuestions();
  return Word.run(async (context) => {
    const getQuestion1 = context.document.contentControls.getByTag("question1").getFirst();
    getQuestion1.load("text");
    const getQuestion2 = context.document.contentControls.getByTag("question2").getFirst();
    getQuestion2.load("text");
    const getQuestion3 = context.document.contentControls.getByTag("question3").getFirst();
    getQuestion3.load("text");
    const getQuestion4 = context.document.contentControls.getByTag("question4").getFirst();
    getQuestion4.load("text");
    const getQuestion5 = context.document.contentControls.getByTag("question5").getFirst();
    getQuestion5.load("text");
    const getQuestion6 = context.document.contentControls.getByTag("question6").getFirst();
    getQuestion6.load("text");
    const getQuestion7 = context.document.contentControls.getByTag("question7").getFirst();
    getQuestion7.load("text");
    const getQuestion8 = context.document.contentControls.getByTag("question8").getFirst();
    getQuestion8.load("text");
    const getQuestion9 = context.document.contentControls.getByTag("question9").getFirst();
    getQuestion9.load("text");
    const getQuestion10 = context.document.contentControls.getByTag("question10").getFirst();
    getQuestion10.load("text");
    // let question = getControl.text;
    // console.log(getControl.text);
    await context.sync().then(function () {
      // console.log(getQuestion1.text);
      axios
        .post("https://mmu-online-exam-addin.herokuapp.com/exams", {
          id: exam_id,
          creator_id: lect_id,
          title: exam_title,
          number_of_questions: numberofQ,
          question1: getQuestion1.text,
          question2: getQuestion2.text,
          question3: getQuestion3.text,
          question4: getQuestion4.text,
          question5: getQuestion5.text,
          question6: getQuestion6.text,
          question7: getQuestion7.text,
          question8: getQuestion8.text,
          question9: getQuestion9.text,
          question10: getQuestion10.text,
        })
        .then((resp) => {
          console.log(resp.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
};

export { createExam, uploadQuestions };
