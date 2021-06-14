import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LabelComponent } from './list/label.component';
import { LabelDetailComponent } from './detail/label-detail.component';
import { LabelRoutingModule } from './route/label-routing.module';

@NgModule({
  imports: [SharedModule, LabelRoutingModule],
  declarations: [LabelComponent, LabelDetailComponent],
})
export class LabelModule {}
