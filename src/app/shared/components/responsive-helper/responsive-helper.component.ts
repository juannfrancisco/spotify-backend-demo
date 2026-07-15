import { Component, OnInit } from '@angular/core';
import { environment } from '@env';

@Component({
  selector: 'app-responsive-helper',
  templateUrl: './responsive-helper.component.html',
  styleUrls: ['./responsive-helper.component.css'],
})
export class ResponsiveHelperComponent implements OnInit {
  public env: any = environment;

  constructor() {}

  ngOnInit(): void {
    // Initialize any additional logic here if needed
  }
}