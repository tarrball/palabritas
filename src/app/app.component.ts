import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './1. features/shared/header/header.component';
import { injectSpeedInsights } from '@vercel/speed-insights';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    injectSpeedInsights();
  }
}
