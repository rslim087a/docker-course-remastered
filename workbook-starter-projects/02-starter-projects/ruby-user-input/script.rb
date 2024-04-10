quotes = [
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Strive not to be a success, but rather to be of value. - Albert Einstein"
]

def print_quote(quote)
  max_width = quote.lines.map(&:length).max + 4
  border = "+" + "-" * (max_width - 2) + "+"

  puts border
  quote.lines.each do |line|
    padding = " " * ((max_width - line.length - 2) / 2)
    puts "|#{padding}#{line.strip.center(max_width - 4)}#{padding}|"
  end
  puts border
end

selected_quote = quotes.sample
print_quote(selected_quote)
