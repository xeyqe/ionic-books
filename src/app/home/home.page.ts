import { Component, OnInit } from '@angular/core';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private text = ['Just', 'give', 'me', 'some', 'text', 'looooonnddddddddddnnggg'];
  private word: string;
  private maxWordLength = 13;

  private preText = '';
  private redText = '';
  private postText = '';
  private progress = 0;

  private i = 0;
  private rangeEnd = 0;
  private isRunning = false;
  private runner: any;
  private fontSize = '20px';
  private speedOfReading = 200;
  private currentProgress = '';
  private selected: number;

  constructor(private int: WebIntent, private platform: Platform) {
    this.selected = 300;
    this.getIntent();
    platform.ready().then(() => {
      this.platform.resume.subscribe(() => {
        this.getIntent();
      });
   });
  }

  getIntent() {
    if (this.platform.is('android')) {
      this.int.getIntent().then((intent) => {
        if (intent.action === 'android.intent.action.SEND') {
          const a = intent.extras['android.intent.extra.TEXT'];
          this.text = a.split(/[\s\n]+/);
          this.rangeEnd = this.text.length;
          this.i = 0;
        }
      });
    }
  }

  pause() {
      this.isRunning = false;
      clearInterval(this.runner);
  }

  execute() {
    this.isRunning = true;
    this.runner = setInterval(() => {
      if (this.i < this.text.length) {

        this.printWord(this.text[this.i]);
        this.updateTime();
        this.progress = (this.i + 1) / this.text.length;
        this.i++;
      } else {
        this.i = 0;
        this.isRunning = false;
        clearInterval(this.runner);
      }
    }, this.speedOfReading);
  }

  run() {
    if (this.text.length > 0) {
      if (this.isRunning) {
        this.pause();
      } else {
        this.execute();
      }
    }
  }

  printWord(word: string) {
    word = word.trim();

    if (word.length === 1) {
      this.preText = '';
      this.redText = word[0];
      this.postText = '';
    } else if (word.length < 6) {
      this.preText = word[0];
      this.redText = word[1];
      this.postText = word.substring(2);
    } else if (word.length < 10) {
      this.preText = word.substring(0, 2);
      this.redText = word[2];
      this.postText = word.substring(3);
    } else {
      this.preText = word.substring(0, 3);
      this.redText = word[3];
      this.postText = word.substring(4);
    }
  }

  increaseFontSize() {
    let str = this.fontSize;
    str = str.substring(0, str.length - 2);
    let num = parseFloat(str);
    if (num < 32) {
      num += 0.1;
    }
    this.fontSize =  num + 'px';
  }

  decreaseFontSize() {
    let str = this.fontSize;
    str = str.substring(0, str.length - 2);
    let num = parseFloat(str);
    if (num > 10) {
      num -= 0.1;
    }
    this.fontSize =  num + 'px';
  }

  changeSpeed(event: any) {
    this.speedOfReading = 60000 / event;
    if (this.isRunning) {
      this.pause();
      this.execute();
    }
    this.updateTime();
  }

  goForward() {
    const num = Math.floor(this.rangeEnd / 100);
    if ((this.i + num) < this.rangeEnd) {
      this.i += num;
    }
    this.updateTime();
    this.printWord(this.text[this.i]);
    this.progress = (this.i + 1) / this.text.length;
  }

  goBack() {
    const num = Math.floor(this.rangeEnd / 100);
    if (this.i > num) {
      this.i -= num;
    }
    this.updateTime();
    this.printWord(this.text[this.i]);
    this.progress = (this.i + 1) / this.text.length;
  }

  updateTime() {
    const num = this.text.length - this.i;
    const ms = num * this.speedOfReading;
    this.msToTime(ms);
  }

  msToTime(ms: number) {
    let restOfSeconds = Math.floor(ms / 1000);
    let hours = String(Math.floor(restOfSeconds / 3600));
    if (hours.length === 1) {
      hours = '0' + hours;
    }
    restOfSeconds %= 3600;
    let minutes = String(Math.floor(restOfSeconds / 60));
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    restOfSeconds %= 60;
    let seconds = String(restOfSeconds);
    if (seconds.length === 1) {
      seconds = '0' + seconds;
    }

    this.currentProgress = hours + ':' + minutes + ':' + seconds;
  }

  onEvent(event: Event) {
    event.stopPropagation();
    if (this.isRunning) {
      this.pause();
    }
 }
}
