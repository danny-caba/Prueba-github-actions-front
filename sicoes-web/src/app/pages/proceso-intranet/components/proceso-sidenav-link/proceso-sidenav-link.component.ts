import { Component, Input, OnInit } from '@angular/core';

interface MailSidenavLink {
  label: string;
  route: string[];
  icon: string;
  check?: boolean;
  status: string;
  routerLinkActiveOptions?: { exact: boolean };
}

@Component({
  selector: 'vex-proceso-sidenav-link',
  templateUrl: './proceso-sidenav-link.component.html',
  styleUrls: ['./proceso-sidenav-link.component.scss']
})
export class ProcesoSidenavLinkComponent implements OnInit {

  @Input() link: MailSidenavLink;

  constructor() { }

  ngOnInit(): void {
  }

}
