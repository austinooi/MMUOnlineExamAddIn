import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const getExam = (exam_code) => {
  const questionBank = [];
  var examTitle;

  axios
    .get(`https://mmu-online-exam-addin.herokuapp.com/exams?id=${exam_code}`)
    .then((input) => {
      const question = input.data;
      examTitle = question[0].title;
      // console.log(question[0].question1);
      questionBank.push(question[0].question1);
      questionBank.push(question[0].question2);
      questionBank.push(question[0].question3);
      questionBank.push(question[0].question4);
      questionBank.push(question[0].question5);
      questionBank.push(question[0].question6);
      questionBank.push(question[0].question7);
      questionBank.push(question[0].question8);
      questionBank.push(question[0].question9);
      questionBank.push(question[0].question10);
    })
    .then(() => {
      console.log(questionBank);
      console.log(questionBank[1]);
      console.log(examTitle);

      return Word.run(async (context) => {
        console.log("get examssssss");
        console.log(questionBank);
        console.log(questionBank[1]);
        // console.log(exam_code)
        context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
        // console.log(text);
        for (let i = 0; i < 10; i++) {
          if (questionBank[9 - i] == " ") {
            const range = context.document.getSelection();
            const questionContentControl = range.insertContentControl();
            questionContentControl.tag = "question" + (9 - i);
            questionContentControl.title = "Question " + (9 - i);
            questionContentControl.cannotEdit = true;
            questionContentControl.cannotDelete = true;
            questionContentControl.appearance = "Hidden";
            questionContentControl.placeholderText = " ";
            questionContentControl.font.size = 12;
            questionContentControl.font.name = "Times New Roman";
          } else {
            context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
            const range = context.document.getSelection();
            const questionContentControl = range.insertContentControl();
            questionContentControl.tag = "question" + (10 - i);
            questionContentControl.title = "Question " + (10 - i);
            questionContentControl.cannotDelete = true;
            questionContentControl.cannotEdit = true;
            questionContentControl.appearance = "Tags";
            questionContentControl.font.size = 12;
            questionContentControl.font.name = "Times New Roman";
            questionContentControl.placeholderText = questionBank[9 - i];
            // questionContentControl.insertText(questionBank[9 - i], Word.InsertLocation.start);
            // questionContentControl.placeholderText(questionBank[9 - i])
            context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
            context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
            // context.document.body.insertText("Question " + (10 - i), Word.InsertLocation.start);
          }
        }

        // context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);
        const range = context.document.getSelection();
        const nameContentControl = range.insertContentControl();
        nameContentControl.tag = "name";
        nameContentControl.title = "Name";
        nameContentControl.cannotEdit = false;
        nameContentControl.cannotDelete = true;
        nameContentControl.appearance = "Tags";
        nameContentControl.font.size = 12;
        nameContentControl.font.name = "Times New Roman";
        nameContentControl.placeholderText = "Enter name here";
        nameContentControl.color = "orange";

        // context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);

        const idContentControl = range.insertContentControl();
        idContentControl.tag = "id";
        idContentControl.title = "ID";
        idContentControl.cannotEdit = false;
        idContentControl.cannotDelete = true;
        idContentControl.appearance = "Tags";
        idContentControl.font.size = 12;
        idContentControl.font.name = "Times New Roman";
        idContentControl.placeholderText = "Enter ID here";
        idContentControl.color = "orange";

        context.document.body.insertBreak(Word.BreakType.line, Word.InsertLocation.start);

        const title = context.document.body.insertText(examTitle, Word.InsertLocation.start);
        title.font.color = "Black";
        title.font.size = 16;
        title.font.underline = "Single";
        title.font.name = "Times New Roman";

        await context.sync();
      });
    });
};

export { getExam };
