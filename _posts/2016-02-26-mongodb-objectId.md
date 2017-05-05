---
layout: post
title: mongodb objectId
---

<br>最近用到mongodb，想起来一个之前面试被问到的一个问题，终于抽时间解决了。
<br>objectId,作为mongo中区别各个文章的唯一标识符，是由12位字节组成，例如：

        ［0 1 2 3］，［4 5 6］ ［7 8］，［9 1 2］

<br>其中前四位是时间戳，以秒级别表示时间，接下来三位是所在主机的唯一标识符，通常是机器主机名的散列值。接下来两位是产生ObjectId的Pid，确保同一台机器上并发产生的ObjectId是唯一的。前九位保证了同一秒钟不同机器的不同进程产生的ObjectId时唯一的。最后三位是自增计数器，确保相同进程同一秒钟产生的ObjectId是唯一的。
下面是个mongoose中利用objectId的例子。

        const mongoose = require('mongoose');
        const Schema = mongoose.Schema;

        let ArticleSchema = new Schema({
        	author_id:{
        		type: Schema.Types.ObjectId,//定义author_id类型是objectId。
        		ref: 'User'
        	}
        });
