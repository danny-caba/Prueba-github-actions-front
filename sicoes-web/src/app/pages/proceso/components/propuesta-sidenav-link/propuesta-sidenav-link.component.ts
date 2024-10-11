import { Component, Input, OnInit } from '@angular/core';

interface MailSidenavLink {
  label: string;
  route: string[];
  icon: string;
  status: string;
  check?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
}

@Component({
  selector: 'vex-propuesta-sidenav-link',
  templateUrl: './propuesta-sidenav-link.component.html',
  styleUrls: ['./propuesta-sidenav-link.component.scss']
})
export class PropuestaSidenavLinkComponent implements OnInit {

  @Input() link: MailSidenavLink;

  constructor() { }

  ngOnInit(): void {
  }

}
