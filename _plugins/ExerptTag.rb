#
# => Liquid Tag that converts full blog content into short entry
#
#

class ExcerptTag < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
  end

  def render(context)
    # Write the output HTML string
    output =  "";

    # Render it on the page by returning it
    return output;
  end
end

Liquid::Template.register_tag('intro', ExcerptTag)
