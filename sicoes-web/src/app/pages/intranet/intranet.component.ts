import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class IntranetComponent implements OnInit {

  form: UntypedFormGroup;

  inputType = 'password';
  visible = false;

  listUsuarioSissged = [{
    username: 'KSILVAP',
    codigo: 'RESP_ADM',
    xxyyxxx: 'fuARzUzp8xG3lgf5ZwXxJdYem7YGJtpVyNMCa/r/1jMFvWBdmH7E/MAi87FqfS2Gp2j3+p8PJciaWN5Bpk1/FCzkf8KBy9LZk40R2u9n7N6w8EN1aWJ39lYYvvF6rtYDBEM8duXAgE6VRpE9C0qVXi/2QQ+btvRkFwCjU4Dykxo='
  },{
    username: 'RZEGARRA',
    codigo: 'EVA_ADM',
    xxyyxxx: '6joTjlStnSLBNBWze/2GK138J38WZ+AKzfv51GHNuyMNgowXSRdhfmrwhNoPwB2csN4BARmk0no1CyJxC463V8PBdyjbujkKMcTWQ4HRgI7NbdDyYQvzfWcp2kIPEEDbp3mMlZzqpzTzVvf2m4xYYm8IA2HRa6DyB073lnnzpDpvp/zOOAd8Xuhyp2wxySk5'
  },{
    username: 'JURCIA',
    codigo: 'EVA_TEC',
    xxyyxxx: 'xnMXR4naxvz2fZT9SMLlRh8m6rFXnmQVVt7nnySeAzCYPcPQ2yEsc4aId086125ErZNvSOIwp0ZLBY7y9HGOaaVbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+9jiCBA4ayBlzLDItJwCzmvbDjjz57ybvlx0g8XFgfGQ='
  },{
    username: 'EFIELD',
    xxyyxxx: 'NEbs3MYOAEWJmSf3V8IOfAvzUi4JPwRutSgvwBUQkB4WMBBYkSSs9+kk6p5U9/dPYT2MTQ6Rfl99nD601UsaY6Vbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+9Xds6Kj8d+jmwexEMD8WB/bDjjz57ybvlx0g8XFgfGQ='
  },{
    username: 'RVERAC',
    xxyyxxx: 'P7DPENzlY/TtfrnvZq7vuZRQHoX3DQCz1W+8rs01QhxyjBf4HJkQoS16A07EatNm0zcGjoYvkDJwMTta5HEG5aVbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+hmFQv3E8iAFsMAZPDCxU1vbDjjz57ybvlx0g8XFgfGQ='
  },{
    username: 'JVASQUEZG',
    xxyyxxx: '43ZbRa/R7YztgmDLfOaPQp6FrXMsCTEdJQCSaIZYQ7tgsuOtFG43/MQq3l5T4fYcFBZp4w0wde3PV1ZHGgFt1opiTLJm/IMN7Zfq4zg2Ox0C3fqelr5RQFGlMJ+20hl3XZLnrL5ixuqier5dpTkcpX5nlT35CYsbnObjUpjoyDNzcvJ4UHLLcOUZXmrj8Q0g'
  }]
  
  constructor(private router: Router,
              private fb: UntypedFormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  send(usu) {
    this.router.navigate([Link.INTRANET, Link.LOGIN_INTRANET], {
      queryParams: {
        xxyyxxx: usu.xxyyxxx
      }
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
