---
layout: post
title:  "Essentials of AutoMapper"
dash-title: "Essentials-of-AutoMapper"
date:   2016-07-14 00:47:03 -0700
primary-image: "heading.jpg"
author: ray_krow
intro: > # "tag:"
  AutoMapper is an amazing tool but it takes organization and
  a certain level of comfort with its tooling to truly use it well.
tags:
  - title: C#
  - title: .NET

categories:
  - title: AutoMapper

---

AutoMapper is amazing, seriously the best. However, I see people often using it in an extremely minimal way and then bending over backwards to write custom code for a bunch of stuff AutoMapper comes built with. Don't be that developer. Get to know AutoMapper, its amazing, seriously the best. If you've never heard of AutoMapper or have never checked out the docs, meet it on [GitHub](https://github.com/AutoMapper/AutoMapper).

## The Basics Of AutoMapper

{% highlight csharp %}

using AutoMapper;

// Initialize Mapper
var config = new MapperConfiguration(config => {});
var mapper = config.CreateMapper();

// Configure a Mapping
mapper.CreateMap<SourceModel, DestinationModel>()
    .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty));

// Map Objects
mapper.map(SourceModel, DestinationModel);

{% endhighlight %}

This is just one way to use AutoMapper, I might say the simplest. What we've done here is import AutoMapper, create an instance of AutoMapper, configure/teach the mapper how to map our two objects, and then map them. Keep in mind that the configuration could have been placed into the initialization like so:

{% highlight csharp %}

// Initialize Mapper
var config = new MapperConfiguration(config => {
    config.CreateMap<SourceModel, DestinationModel>()
        .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty));
});

var mapper = config.CreateMapper();

{% endhighlight %}

To abstract another level for the best organization I recommend placing all of your mapping configurations in organized files relative to their purpose and then call all of those methods inside the `MapperConfiguration(config => config)` lambda.

{% highlight csharp %}

//
// In one organized file: Boats/MappingConfig.cs
//

public static class MappingConfig
{
    // All Mappings for boats
    public static MapperConfiguration RegisterMappings()
    {
        return new MapperConfiguration(config => {
            config.CreateMap<BoatViewModel, BoatModel>()
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty));
        });
    }
}

//
// In another organized file: Cars/MappingConfig.cs
//

public static class MappingConfig
{
    // All Mappings for cars
    public static MapperConfiguration RegisterMappings()
    {
        return new MapperConfiguration(config => {
            config.CreateMap<CarViewModel, CarModel>()
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty))
                .ForMember(dest => dest.destProperty, opt => opt.MapFrom(src => src.sourceProperty));
        });
    }
}

//
// Now in a startup file (startup.cs in .NET Core or Global.asax in earlier version)
//

// Initialize Mapper
var config = new MapperConfiguration(config => {
    Cars.MappingConfig.RegisterMappings();
    Boats.MappingConfig.RegisterMappings();
});

var mapper = config.CreateMapper();

{% endhighlight %}

Now you can have all of your mappings organized into separate files that can be placed into their respective places. Do this, it will make everyones life easier for you and anyone else who needs to quickly understand your code.

## Type Converters and Value Resolvers
Sometimes you have complex objects that are created by mapping a handful of fields into a new object. the basic `MapFrom()` methods suddenly won't do the trick. You need some more advanced logic to look through the source object, possible make calculations or conversions, and then create and return a new object with all its fields. Type Converters and Value Resolvers can do this. Here's an example where all the properties in the view model have been broken down into a single level and now need to be mapped into complex types in the db model.

{% highlight csharp %}

//
// DB Models
//

public class PersonModel
{
    public string Name { get; set; }
    public Contact ContactInfo { get; set; }
}

public class Contact
{
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
}

//
// View Model
//

public PersonViewModel
{
    public string PersonName { get; set; }
    public string PersonEmail { get; set; }
    public string PersonNumber { get; set; }
}

{% endhighlight %}

Here we are going to try to map from the PersonViewModel to the PersonModel so that we can theoretically store the data in the db table. Because we've organized our db well and have some related properties separated into a separate Contact class the mapping will not be a simple one to one. The reason for this is that before AutoMapper can populate any fields in the ContactInfo property an instance of the type has to first be initialized.

To be upfront and honest. There are ways to do this without a Value Resolver or a Type Converter. We will go over those later and the reasons you should usually avoid them and take the time to implement these tools.

Incase you don't understand why we can't simply map these like before I wan't to point it out.


{% highlight csharp linenos %}

// Attempt to map one to one -> will NOT work
mapper.CreateMap<PersonViewModel, PersonModel>()
    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.PersonName))
    .ForMember(dest => dest.ContactInfo.Email, opt => opt.MapFrom(src => src.PersonEmail))
    .ForMember(dest => dest.ContactInfo.PhoneNumber, opt => opt.MapFrom(src => src.PersonNumber));

{% endhighlight %}

The problem is in line 4 and 5. Were trying to access the property of an object that has not been instantiated. If you try this AutoMapper will yell at you with an exception at runtime. Let's solve this with both a Type Converter and a Value Resolver and take a look at the differences.

### Custom Type Converters
A type converter will always inherit from AutoMapper's `ITypeConverter`. You will pass it the destination and source types when you inherit `ITypeConverter<sourceType, destType>`. Lastly, AutoMapper expects you to implement a Convert method that has a return type of DestType and is passed `Convert(SourceType source, DestType dest, ResolutionContext context)` so that it can call your converter. That was horribly confusing, allow the code to explain.

{% highlight csharp %}

public class PersonInfoConverter : ITypeConverter<PersonViewModel, PersonModel>
{

    public PersonModel Convert(PersonViewModel source, PersonModel destination, ResolutionContext context)
    {
        // Do any logic you fancy and then return the resulting object
        var contactInfo = new Contact {
            Email = source.PersonEmail,
            PhoneNumber = source.PersonNumber
        }
        return new PersonModel {
            Name = source.PersonName,
            ContactInfo = contactInfo
        };
    }
}

{% endhighlight %}

To use this Type Converter in the mapping we would simply tell our config that it exists and that we want it to use this converter anytime it sees an attempt to map the PersonViewModel to the PersonModel.

{% highlight csharp %}

// Setup
mapper.CreateMap<PersonViewModel, PersonModel>().ConvertUsing(new PersonInfoConverter);

// Use - where personViewModel is some instance of the PersonViewModel class
PersonModel person = Mapper.Map<PersonModel>(personViewModel)

{% endhighlight %}

The nice thing about Type Converters is that you only have to declare it in the mapping a single time but use it as much as you need. Once the mapper is aware of the converter you want to use when mapping two specific objects it will always use it anytime it needs to map two items of those types.

As always I reccommend you at least overlook the official documentation on the [AutoMapper wiki](https://github.com/AutoMapper/AutoMapper/wiki/Custom-type-converters).

### Custom Value Resolvers
A Value Resolver is mostly different from a Type Converter in the fact that it needs to be called for usage each and every time it is needed. Although this may sound like a turn off, I actually prefer it because it helps keep mapping files that can be hundreds of lines long and broken into multiple files understandable when each and every mapping is strongly declared how it is mapped in every line. The Value Resolver is implemented in almost exactly the same manner as the Type Converter except it also requires the type of the specific member it is converting to be passed to the parent class `IValueResolver` as well as also passing that member to the `Resolve()` method. Again, the code explains far better.

{% highlight csharp %}

public class PersonInfoResolver : IValueResolver<SourceModelType, DestModelType, DestMemberType>
{
    public DestMemberType Resolve(SourceModelType source, DestModelType destination, DestMemberType destMember, ResolutionContext context)
    {
        return new DestMemberType();
    }
}

{% endhighlight %}

Converting our Person models it looks like this. I'd like to note, one of the upsides to using the Value Converter is that you can be more implicit by still mapping a single member item but also have access to the entire source object in the resolver.

{% highlight csharp %}

public class PersonInfoResolver : IValueResolver<PersonViewModel, PersonModel, Contact>
{
    public Contact Resolve(PersonViewModel source, PersonModel destination, Contact destMember, ResolutionContext context)
    {
        return new Contact {
            Email = source.PersonEmail,
            PhoneNumber = source.PersonNumber
        }
    }
}

{% endhighlight %}

As I've been saying, the big difference comes now when you're forced to declare the resolver for each and every mapping between the SourceModel and DestModel you created it for.

{% highlight csharp %}

// Setup
mapper.CreateMap<PersonViewModel, PersonModel>()
    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.PersonName))
    .ForMember(dest => dest.ContactInfo, opt => opt.ResolveUsing<PersonInfoResolver>());

// Use - again where personViewModel is some instance of the PersonViewModel class
PersonModel person = Mapper.Map<PersonModel>(personViewModel)

{% endhighlight %}

As always I reccommend you at least overlook the official documentation on the [AutoMapper wiki](https://github.com/AutoMapper/AutoMapper/wiki/Custom-value-resolvers).

### The Big Difference Between Resolvers and Converters
You can declare a Type Converter once and AutoMapper will always there after use it when mapping those types without having to again be told to use it. A Value Converter on the other hand needs to be mentioned specifically each and every time you would like to use it.

## Meet The Maker
I can only tell you what I know. Jimmy Bogart is the creator of AutoMapper and he keeps up a pretty great and informational [blog](https://lostechies.com/jimmybogard/category/automapper/) about it. Go see it.
