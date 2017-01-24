---
layout: post
title:  "Pro Tip: The While Loop"
dash-title: "Pro-Tip-The-While-Loop"
date:   2017-01-20 00:47:03 -0700
primary-image: "heading.jpg"
photo_credit_url: "https://unsplash.com/search/loop?photo=FOsina4f7qM"
photo_alt: "An image of rollercoaster loops"
author: ray_krow
sitemap:
  priority: 0.7
  changefreq: 'monthly'
  lastmod: 2017-01-21T12:49:30-05:00
intro: > # "tag:"
  No matter what language your using while loops can get out of hand real quick, I'm sure we all know that.
  The difficult part is stopping once your looping. Humor me, lets look at how to stop.
tags:
  - title: C#
  - title: .NET

categories:
  - title: AutoMapper

series: protip

---

The other day I was sitting at work implementing a feature in some code I did not write and I was rather unsure 'exactly' how it worked. It over utilized the while loop. There were multi-double-nested while loops. Think about that! Anyway, I was slaving away at my feature in this mess of while loops and right when I thought I had gotten it finished the app started crashing every time I tested it. I'm sad to say it took me a solid 15 minutes to realize that I had forgotten to `moveNext()` (it happened to be VB) at the end of a while loop I had altered so the while loop was running away and killing the memory. So, **Pro Tip: No matter what language your working in, always be sure you iterate your while loops**. Heres a few examples.



## The VB while loop

{% highlight vb %}

    dim data(0)

    while not recordset.eof

        Array.Resize(data, data.Length + 1)
        data(data.Length - 1) = item

        recordset.moveNext ' PROTIP

    wend

{% endhighlight %}



## The Javascript while loop

{% highlight javascript %}

    let data = [];

    let i = 0;
    while (i < recordset.length) {

        data.push(recordset[i]);

        i++; // PROTIP

    }

{% endhighlight %}



## The C# while loop

{% highlight csharp %}

    IList<string> data = new List<string>();

    int i = 0;
    while (i < recordset.length) {

        data.add(recordset.ElementAt(i));

        i++; // PROTIP

    }

{% endhighlight %}



## The Python while loop

{% highlight python %}

    data = []

    i = 0
    while (i < len(recordset)):

        data.append(recordset[i])

        i = i + 1 # PROTIP

{% endhighlight %}




## The Ruby while loop

{% highlight ruby %}

    data = []

    i = 0
    while i < recordset.length  do

        data << recordset[i]

        i +=1 # PROTIP
    end

{% endhighlight %}
