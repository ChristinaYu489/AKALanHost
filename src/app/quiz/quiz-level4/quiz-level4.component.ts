import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { quizContentHandler } from '../quiz-content-handler';
import { timerHandler } from '../timer/timer.component';
import { Router } from '@angular/router';
import { quizComponentHandler } from '../quiz.component';

@Component({
  selector: 'app-quiz-level4',
  templateUrl: './quiz-level4.component.html',
  styleUrls: ['./quiz-level4.component.css']
})
export class QuizLevel4Component implements OnInit {
  isActiveRadioBox = false;
  a1 = "a"
  a2 = "a"
  a3 = "a"
  a4 = "a"

  quizImageUrl = "";
  quizAnswer = "";

  @ViewChild('select_group') selectGroup;
  selectInputGroup;

  constructor(private router: Router, private cdr : ChangeDetectorRef, private ngZone : NgZone) {
  }

  ngOnInit() {
    this.cdr.detectChanges();
    let locale = localStorage.getItem('locale');
    timerHandler.setTimeCount(0);
    timerHandler.start();
    this.quizImageUrl = quizContentHandler.currentQuiz['quiz'];
    quizContentHandler.setOnQuizChangedListener((quiz) => {
      this.quizImageUrl = quiz['quiz'];
      this.quizAnswer = quiz['answer'];
      this.a1 = quiz['answer_contents'][0];
      this.a2 = quiz['answer_contents'][1];
      this.a3 = quiz['answer_contents'][2];
      this.a4 = quiz['answer_contents'][3];
    });
    quizContentHandler.generateQuizList(4);
    timerHandler.setTimerCompleteListener(() => {
      this.selectValue();
    });
    this.selectInputGroup = this.selectGroup.nativeElement.getElementsByTagName('input');
  }

  activateRadioBox() {
    this.isActiveRadioBox = true;
    this.cdr.detectChanges();
  }

  correctCount = 0;
  wrongCount = 0;
  selectValue() {
    let value = this.getValue();
    if (this.checkAnswer(value)) {
      this.correctCount++;
    } else {
      this.wrongCount++;
    }
    this.submitAnswer(value);
    this.isActiveRadioBox = false;
    for (let i = 0; i < this.selectInputGroup.length; i++) {
      this.selectInputGroup[i].checked = false;
    }

    this.nextQuiz();
  }

  getValue() {
    let value = 0;
    for (let i = 0; i < this.selectInputGroup.length; i++) {
      if (this.selectInputGroup[i].checked) {
        value = this.selectInputGroup[i].value;
      }
    }
    return value;
  }

  checkAnswer(value) {
    if (value == this.quizAnswer) {
      return true;
    } else {
      return false;
    }
  }

  submitAnswer(value) {
    quizContentHandler.submitAnswer(value);
  }

  nextQuiz() {
    console.log(this.correctCount + "/" + this.wrongCount);
    if (3 <= this.correctCount) {
      quizContentHandler.setLevel(5);
      setTimeout(()=>{quizComponentHandler.component.cdr.detectChanges();},0);
      return;
    } else if (3 <= this.wrongCount) {
      this.ngZone.run(()=>{this.router.navigate(['result'])});
    } else {
      quizContentHandler.quizPass();
      timerHandler.setTimeCount(0);
      timerHandler.start();
    }
    this.cdr.detectChanges();
  }
}
