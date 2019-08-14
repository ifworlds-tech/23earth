require 'nokogiri'
require 'json'

$input_image = 'input.svg'
$output_image = 'output.svg'

$ocean_selector = 'path#ocean'
$land_selector = '//xmlns:path[@id!="ocean" and not(ancestor-or-self::*[contains(@class, "landxx")])]'

$full_width = 7498.9
$full_height = 4238.2


def parse_path(d)
    d.split(" ").map{|c| /^([-\de.]+),([-\de.]+)$/ === c ? [$1.to_f, $2.to_f] : c}
end

def merge_path(arr)
    arr.map{|x| x.is_a?(String) ? x : x.map(&:to_s).join(",")}.join(" ")
end


doc = Nokogiri::XML.parse(File.read $input_image)

ocean_points = parse_path(doc.at($ocean_selector)[:d]).reject{|x| x.is_a? String}
min_ox = ocean_points.map{|op| op[0]}.sort[1]
max_ox = ocean_points.map{|op| op[0]}.sort[-2]
min_oy = ocean_points.map{|op| op[1]}.sort[1]
max_oy = ocean_points.map{|op| op[1]}.sort[-2]
xwidth = max_ox - min_ox
ocean_points.reject!{|pos|
    x, y = pos
    x < min_ox || x > max_ox
}

d_list = doc.xpath($land_selector).map{|node|
    mode = nil
    x_width = 0
    d = parse_path(node[:d]).map { |pos|
        if pos.is_a?(String)
            mode = pos
            next pos 
        end
        pos
        # nx = $full_width * (x - min_ox) / x_width
        # ny = $full_height * (y - min_oy) / (max_oy - min_oy)
        # case mode
        # when 'm', 'M', 'l'
        #     nx = $full_width * (x - min_ox) / xwidth
        #     ny = $full_height * (y - min_oy) / (max_oy - min_oy)
        #     [nx, ny]
        # when 'c'
        #     [x, y]
        # else
        #     raise mode
        # end
        # case mode
        # when 'm', 'M', 'l'
        #     ox = ocean_points.min_by{ |op|
        #         ox, oy = op
        #         (oy - y).abs
        #     }.first
        #     x_width = max_ox- min_ox - 2*[max_ox - ox, ox - min_ox].min
        #     nx = $full_width * (x - min_ox) / x_width
        #     ny = $full_height * (y - min_oy) / (max_oy - min_oy)
        #     p x_width
        #     [nx, ny]
        # when 'c'
        #     nx = x * xwidth / x_width
        #     [x, y]
        # else
        #     raise mode
        # end
    }
    [node[:id], merge_path(d)]
}.to_h

File.write $output_image, %Q{
    <svg 
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns="http://www.w3.org/2000/svg"
        width="#{$full_width}"
        height="#{$full_height}"
        viewBox="0 0 #{$full_width} #{$full_height}"
    >#{d_list.values.map{|d| %Q{<path fill="black" d="#{ d }"/>}}.join("\n")}</svg>
}

File.write 'data.json', {"width": $full_width, "height": $full_height, "parts": d_list.map{|id, d| {:id => id, :path => d}}}.to_json