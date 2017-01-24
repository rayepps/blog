---
layout: post
title:  "Keeping Your Secret Config Private"
dash-title: "Keeping-Your-Secret-Config-Private"
date:   2017-01-19 00:47:03 -0700
primary-image: "heading.jpg"
photo_credit_url: "//unsplash.com/photos/-id1HKapEbc"
photo_alt: "An image of a cave with a warm light shinning out"
author: ray_krow
sitemap:
  priority: 0.7
  changefreq: 'monthly'
  lastmod: 2017-01-21T12:49:30-05:00
intro: > # "tag:"
  Where do you keep your database passwords for open source projects? I
  recommend a deep dark cave where nobody can ever find them. But how do
  you do that if you need it in the source code...but the source code is open?
  There are a lot of solutions, I'll share mine.

---


Lets get right to the point, you have to keep all your credentials in two places. You need to have them in production and development and available to the application in a way that it will expect. I'll show you how to do this with a .Net/Azure application here and possible add other environments examples later.

## Whats The Issue?
In case your here reading for leisure and not sure what the issue were trying to solve is, the problem is that anyone can browse your open source projects and if they find database usernames and passwords, API keys, and other very secret information...well, you really don't want that. Let's say your a well organized developer so application wide variables are in a file creatively named Application.cs. It might look like this.


{% highlight csharp %}

public static class Application
{
  public static readonly string DatabaseUsername = "magicunicorn";
  public static readonly string DatabasePassword = "Iloveun1corn2";
  public static readonly string SecretApiKey = "noseriouslyGoUn1corns";
}

{% endhighlight %}

So, imagine this is checked into git and public on GitHub, thats not good. But, you can't simply remove them can you...Your application needs them! With a little work, you can.

## The Local Secrets

The first thing to do of course is get your development environment working having your secrets in the source code. Using dotnet specifically the easiest way to do this with the latest versions is to create a file `appsettings.local.json` and place it on your local machine somewhere that is machine and user agnostic like `c/`. Make it look like this.

{% highlight json %}

{
  "Database": {
    "Password": "Iloveun1corn2",
    "Username": "magicunicorn"
  },
  "Api": {
    "Key": "noseriouslyGoUn1corns"
  }
}

{% endhighlight %}

Then, somewhere in initialization, create a new instance of a class that looks something like this and inside of it look up that json file, wherever you choose to stick it, and get the values you need from it.

{% highlight csharp %}


using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Environment;


public class Application
{

    public string DatabasePassword;
    public string DatabaseUsername;
    public string SecretApiKey;

    public Application()
    {
        /*
        *   Here we decide if were running remotely or not, this is how I do it,
        *   its prety simple to add an env var to the server, probably not for
        *   everyone but you get the idea.
        */
        if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("IsRunningInAzure")))
        {
            // Were running remotly -> get env variables...
        } else
        {
            // Were running locally -> get env variables...

            var config = new ConfigurationBuilder()
                .SetBasePath(LocalAppsettingsLocation)
                .AddJsonFile("appsettings.local.json")
                .Build();

            var database = config.GetSection("Database");
            DatabasePassword = database.GetSection("Password").Value;
            DatabaseUsername = database.GetSection("Username").Value;

            var api = config.GetSection("Api");
            SecretApiKey = api.GetSection("Key").Value;

        }
    }
}


{% endhighlight %}


Now if you run your application locally, create an instance of your `Application` class and make it available, possibly as a singleton, you can access the values you have in your local json file (a file nobody in version control could ever see).

## Remote Secret Keeping

I would say this is a little more straight forward. We've already done 99% of the work for development. All we need to do now is add the secrets to the server as environment variables and add a little logic to our `Application` class. If your using Azure to host your dotnet app go to  [stackoverflow](http://stackoverflow.com/questions/34608769/how-and-where-to-define-an-environment-variable-on-azure) to find directions on how to add custom environment variables. If your using another platform you'll have to google. If your managing your own server, I'm going to assume you don't need to be told how to make an environment variable.

Onto the code! All were going to do is add a little logic to the class we just used.

{% highlight csharp %}

// ...

if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("IsRunningInAzure")))
{
    // Were running remotly -> get env variables...
    DatabaseUsername = Environment.GetEnvironmentVariable("DbUsername");
    DatabasePassword = Environment.GetEnvironmentVariable("DbPassword");
    SecretApiKey = Environment.GetEnvironmentVariable("ApiKey");

} else

// ...

{% endhighlight %}
