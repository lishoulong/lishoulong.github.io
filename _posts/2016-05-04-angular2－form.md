---
layout: post
title: angular2表单经验分享
---

<br>上段时间看了一本angular2的书籍“ng－book2”，感觉很多地方讲的很深入，所以这里拿出来分享一下我的心得。
<br>form表单
<br>框架的表单之前用的比较多的是bootstrap自带表单，以及react系的redux form，感觉用angular <br>form还是不错的。
<br>angular2提供的部分：
<br>• Controls encapsulate the inputs in our forms and give us objects to work with them
<br>• Validators give us the ability to validate inputs, any way we’d like
<br>• Observers let us watch our form for changes and respond accordingly
<br>两个基本要素是Control and ControlGroup。
<br>引入directives “FORM_DIRECTIVES”，包括“ngControl，ngControlGroup，ngForm，<br>ngModel，ngFormModel等”。下面是template的几种表示方法。

         "@Component({
           selector: 'demo-form-sku',
           directives: [FORM_DIRECTIVES],
           template: `
              <div class="ui raised segment">
              <form #f="ngForm" (ngSubmit)="onSubmit(f.value)" class="ui form">
                <input type="text" ngControl="sku">
              </form>
            `
        ｝）
        export class DemoFormSku {
        onSubmit(form: any): void {
          console.log('you submitted value:', form);
        }"

在这种情况下，我们创建一个controlgroup叫ngForm，同时把值赋给变量f，这样f.value就可以表示表单的所有的值。这种优点是方便，缺点是不够个性化，这时候就引入FormBuilder。
<br>fromBuilder在constructor中定义的，主要有两个变量，
<br>• control - creates a new Control
<br>• group - creates a new ControlGroup

        "@Component({
            selector: 'demo-form-sku-builder',
            directives: [FORM_DIRECTIVES],
            template: `
            <div class="ui raised segment">
              <h2 class="ui header">Demo Form: Sku with Builder</h2>
              <form [ngFormModel]="myForm"
                    (ngSubmit)="onSubmit(myForm.value)"
                    class="ui form">

                <div class="field">
                  <label for="skuInput">SKU</label>
                  <input type="text"
                         id="skuInput"
                         placeholder="SKU"
                         [ngFormControl]="myForm.controls['sku']">
                </div>

              <button type="submit" class="ui button">Submit</button>
              </form>
            </div>
            `
            })
        export class DemoFormSkuBuilder {
          myForm: ControlGroup;

            constructor(fb: FormBuilder) {
              this.myForm = fb.group({
                'sku': ['ABC123']
              });
            }

            onSubmit(value: string): void {
              console.log('you submitted value: ', value);
            }
          }"

<br>这里首先在constructor中定义FormBuilder，然后把它赋值给变量fb，然后在fb.group中定义sku元素，在template中直接把实例化后的FormBuilder赋值给myform，这个需要通过directive ngFormModel来实现。然后用ngFormControl来表示具体的control。

具体的表单验证就不在这里多提及了。
